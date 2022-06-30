/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Req,
  Res,
  
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { connection, Model } from 'mongoose';
import { NewUser } from '../../models/dto/newUser.dto';
import { User } from '../../models/user.model';
import { generateActivationToken } from '../../utils/activation/activation.util';
import { sanitizeUser } from '../../utils/sanitation/sanitation.util';
import wiki from 'wikijs';
const axios = require('axios')
// import * as multer from 'multer';
// import * as AWS from 'aws-sdk';
// import * as multerS3 from 'multer-s3';


// import { request } from 'express';

import { Cron } from '@nestjs/schedule';
import { Trip } from 'src/models/trip.model';

// import { json } from 'body-parser';
// import { CommunicationBody } from 'aws-sdk/clients/support';

// import { addedToWaitlist } from 'src/utils/emailTemplate/waitlistemail.util';


@Injectable()
export class UserService {
  // private subscriptions: webPush.PushSubscription[] = [];
  constructor(
 
    @InjectModel('User') private readonly userModel: Model<User>,

    @InjectModel('Trip') private readonly tripModel: Model<Trip>,

    @InjectModel('UserDuplicate')
    private readonly userDuplicateModel: Model<User>,
  ) {
   
  }
mainkeywordarray = ["Best places in "]
nightlifekeywordarray = ["clubs in ", "bars in "]
foodkeywordarray = ["restaurants in ", "food in ", "food places in ", "cafes in ", "coffee in ", "bars in "]
  public async findUserById(uid: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel
        .findById(uid)
        .populate(user)
        .exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }

    return user;
  }

  
  async findemailbyfbid(id: string): Promise<any> {
    const mail = await this.findByFbid(id);
    if (mail) {
      const email = mail.email.toString();
      const bod = {
        email: email,
      };
      return bod;
    } else {
      return null;
    }
  }
  async create(user: NewUser): Promise<User> {
    const alreadyPresentUser = await this.findByEmail(user.email);
    if (alreadyPresentUser) {
      throw new BadRequestException('This email is already in use');
    }
    user.activationToken = generateActivationToken();
    user.activationExpires = Date.now() + 24 * 3600 * 1000;

    if (user.gender === 'female') {
      user.imgpath =
        'https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png';
    } else {
      user.imgpath = 'https://image.flaticon.com/icons/png/512/147/147144.png';
    }
    user.status = 'online';
    const newUser = await new this.userModel(user).save();

    const data = {
      name: newUser.fName,
      link: `http://app.creatospace.com/accountactivated/${newUser._id}/${newUser.activationToken}`,
      email: newUser.email,
    };
    // sendWelcomeMail(data);

    return sanitizeUser(newUser);
  }
  async createUserIp(user: NewUser): Promise<User> {
    const alreadyPresentUser = await this.findByEmail(user.email);
    if (alreadyPresentUser) {
      throw new BadRequestException('This email is already in use');
    }
    user.activationToken = generateActivationToken();
    user.activationExpires = Date.now() + 24 * 3600 * 1000;

    if (user.gender === 'female') {
      user.imgpath =
        'https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png';
    } else {
      user.imgpath = 'https://image.flaticon.com/icons/png/512/147/147144.png';
    }
    user.status = 'online';
    const newUser = await new this.userModel(user).save();
    // sendWelcomeMail(data);

    return sanitizeUser(newUser);
  }
  // async createLinkedin(user: Linki): Promise<Linkedin> {

  //   const newUser = await new this.linkedinModel(user).save();

  //  return newUser
  // }
  async createGoogle(user: NewUser): Promise<User> {
    const alreadyPresentUser = await this.findByEmail(user.email);
    if (alreadyPresentUser) {
      throw new BadRequestException('This email is already in use');
    }
    user.status = 'online';
    user.activationToken = generateActivationToken();
    user.activationExpires = Date.now() + 24 * 3600 * 1000;
    user.active = 'true';
    const newUser = await new this.userModel(user).save();

    return sanitizeUser(newUser);
  }
  // async createFacebook(user: NewUserGoogle): Promise<User> {
  //   const alreadyPresentUser = await this.findByFbid(user.fbid);
  //   if (alreadyPresentUser) {
  //     throw new BadRequestException('This User has already Registered');
  //   }
  //   user.status = 'online';
  //   user.activationToken = generateActivationToken();
  //   user.activationExpires = Date.now() + 24 * 3600 * 1000;
  //   user.active = 'true';
  //   const newUser = await new this.userModel(user).save();

  //   return sanitizeUser(newUser);
  // }

  async activateUser(uid: string, activationToken: string): Promise<User> {
    const user = await this.userModel.findOne({
      _id: uid,
      activationToken: activationToken,
    });

    if (!user)
      throw new NotFoundException(
        'Cannot find the specific user with the provided credentials',
      );

    if (user.active)
      throw new BadRequestException('This user has already been activated');

    if (!(user.activationExpires > Date.now()))
      throw new ForbiddenException(
        'This user cannot be activated due to security reasons',
      );

    user.active = true;
    const activatedUser = await user.save();
    return sanitizeUser(activatedUser);
  }

  async grantAccess(uid: string, authToken: string) {
    if (!uid || !authToken) throw new BadRequestException();

    const user = await this.findUserById(uid);
    user.access_tokens = user.access_tokens.concat({
      token: authToken,
    });
    const verifiedUser = await user.save();
    return {
      user: sanitizeUser(verifiedUser),
      authToken,
    };
  }

  async revokeAccess(uid: string, authToken: string) {
    const user = await this.findUserById(uid);
    user.access_tokens = user.access_tokens.filter(
      token => token.token !== authToken,
    );
    const verifiedUser = await user.save();
    return sanitizeUser(verifiedUser);
  }

  /**
   * * Revoke all access to users by destroying ALL authentication tokens issued against their profile.
   * @param uid : Accepts user id of type 'string'.
   * @returns: A Promise of type 'User'.
   */

  async revokeAccessAll(uid: string) {
    const user = await this.findUserById(uid);
    user.access_tokens = [];
    const verifiedUser = await user.save();
    return sanitizeUser(verifiedUser);
  }

  async queryAutoComplete(query:string) {
    const url  = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&language=en&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
    
    const response = await axios.get(url);
    
    const newArr=[];
    for (let i = 0; i < response.data.predictions.length; i++) {
      const place = response.data.predictions[i];
      const newObj = {
        description : place.description,
        place_id : place.place_id
      }
      newArr.push(newObj);
      
    }
    return newArr;
  }
  async textSearch(query:string) {
    const url  = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;

    const response = await axios.get(url);

    const newArr=[];
   
    for (let i = 0; i < response.data.results.length; i++) {
      const place = response.data.results[i];
      const newObj = {
        description : place?.name,
        place_id : place?.place_id,
        photos: this.photosArray(place.photos),
        coordinates: place?.geometry.location,
        address: place?.formatted_address,

        rating: place?.rating,
        types: place?.types,
      }
      newArr.push(newObj);
    }
    return newArr;

  }
async getphotsFromPlaceId(placeId:string) {
  const url  = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;

  const response = await axios.get(url);

  const photos = this.photosArray(response.data.result.photos)


  return photos;
}


  async getPlaceDetails(place_id:string) {

    const url  = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;

    const response = await axios.get(url);
    
    if(response.data.result.photos != undefined){
    const photos  = this.photosArray(response.data.result.photos)
    response.data.result['photos'] = photos;
    }
    try {
    const summ = await (await this.getWiki(response.data.result.address_components[0].long_name)).summary()
    response.data.result['summary'] =  summ.split('.').slice(0,2).join('.');
    return response.data.result;
    }
    catch {
      const summ = response.data.result.address_components[0].long_name + 'is a popular addition to a number of travellers throughout the world'
      response.data.result['summary'] =  summ
      return response.data.result;
    }
   
  }
  
  async getNearbyPlaces(queryText) {

let placesArray =[]
    for (let i = 0; i < this.mainkeywordarray.length; i++) {
    const finalQueryText = this.mainkeywordarray[i] + queryText;
   
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${finalQueryText}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
    const response = await axios.get(url);
    
    for (let i = 0; i < response.data.results.length; i++) {
     
    if(response.data.results[i].hasOwnProperty('photos')){
    const photos = this.photosArray(response.data.results[i].photos);
    const newObj = {
      place_name : response.data.results[i].name,
      formatted_address : response.data.results[i].formatted_address,
      location : response.data.results[i].location,
      opening_hours : response.data.results[i].opening_hours,
      boundaryRight : response.data.results[i].geometry.viewport.northeast,
      boundaryLeft : response.data.results[i].geometry.viewport.southwest,
      photos : photos,
      place_id : response.data.results[i].place_id,
      rating : response.data.results[i].rating,
      types : response.data.results[i].types,
      url : response.data.results[i].url,
      user_ratings_total : response.data.results[i].user_ratings_total,
  }
  placesArray.push(newObj)
}
    }

    
  
  
   
   
  }
  return placesArray;
}
async postToTrip(id, obj) {
  const trip = await this.tripModel.findById(id);
  trip.tripObj = obj
  return trip.save();
}
  async getPlan(ip,query) {

    let startDate;
    let endDate;
    let tripName;
    let totalDays;
    let summ;
    let from;
    let to;
    const placesArray = []
    
    if(query.hasOwnProperty('startDate') && query.hasOwnProperty('endDate')){
      startDate = query.startDate
     endDate = query.endDate
      const startDateObj = new Date(startDate)
      const endDateObj = new Date(endDate)
     totalDays = (endDateObj.getTime()-startDateObj.getTime())/(1000 * 3600 * 24)
     
     
    }

    
      const place_idFrom = query.from;
      const place_idTo = query.to;
      
      const urlFrom = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_idFrom}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;

      const urlTo = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_idTo}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
      const responseFrom = await axios.get(urlFrom);
      const responseTo = await axios.get(urlTo);
     console.log(responseFrom.data.result)
      const photosF = this.photosArray(responseFrom.data.result.photos);
      const photosT = this.photosArray(responseTo.data.result.photos);
      // from place
      try {
        const summ = await (await this.getWiki(responseFrom.data.result.address_components[0].long_name)).summary()
        const res =  summ.split('.').slice(0,2).join('.');
        const bestPlaces = await this.getNearbyPlaces(responseFrom.data.result.address_components[0].long_name)
        const newObj = {
          place_name : responseFrom.data.result.address_components[0].long_name,
          formatted_address : responseFrom.data.result.formatted_address,
          location : responseFrom.data.result.geometry.location,
      
          boundaryRight : responseFrom.data.result.geometry.viewport.northeast,
          boundaryLeft : responseFrom.data.result.geometry.viewport.southwest,
          photos : photosF,
          place_id : responseFrom.data.result.place_id,
          rating : responseFrom.data.result.rating,
          types : responseFrom.data.result.types,
          url : responseFrom.data.result.url,
          vicinity : responseFrom.data.result.vicinity,
         summary: res.split('.').slice(0,3).join('.'),
         bestPlaces: bestPlaces, 
      }
      
       placesArray.push(newObj)
       
        }
        catch {
          const summ = responseFrom.data.result.address_components[0].long_name + 'is a popular addition to a number of travellers throughout the world'
const res =  summ
          const bestPlaces = await this.getNearbyPlaces(responseFrom.data.result.address_components[0].long_name)
          const newObj = {
            place_name : responseFrom.data.result.address_components[0].long_name,
            formatted_address : responseFrom.data.result.formatted_address,
            location : responseFrom.data.result.geometry.location,
        
            boundaryRight : responseFrom.data.result.geometry.viewport.northeast,
            boundaryLeft : responseFrom.data.result.geometry.viewport.southwest,
            photos : photosF,
            place_id : responseFrom.data.result.place_id,
            rating : responseFrom.data.result.rating,
            types : responseFrom.data.result.types,
            url : responseFrom.data.result.url,
            vicinity : responseFrom.data.result.vicinity,
           summary: res.split('.').slice(0,3).join('.'),
           bestPlaces: bestPlaces, 
        }
        
        placesArray.push(newObj)
        }

        try {
          const summ = await (await this.getWiki(responseTo.data.result.address_components[0].long_name)).summary()
          const res =  summ.split('.').slice(0,2).join('.');
          const bestPlaces = await this.getNearbyPlaces(responseTo.data.result.address_components[0].long_name)
          const newObj = {
            place_name : responseTo.data.result.address_components[0].long_name,
            formatted_address : responseTo.data.result.formatted_address,
            location : responseTo.data.result.geometry.location,
        
            boundaryRight : responseTo.data.result.geometry.viewport.northeast,
            boundaryLeft : responseTo.data.result.geometry.viewport.southwest,
            photos : photosT,
            place_id : responseTo.data.result.place_id,
            rating : responseTo.data.result.rating,
            types : responseTo.data.result.types,
            url : responseTo.data.result.url,
            vicinity : responseTo.data.result.vicinity,
           summary: res.split('.').slice(0,3).join('.'),
           bestPlaces: bestPlaces, 
        }
        
         placesArray.push(newObj)
         
          }
          catch {
            const summ = responseTo.data.result.address_components[0].long_name + 'is a popular addition to a number of travellers throughout the world'
  const res =  summ
            const bestPlaces = await this.getNearbyPlaces(responseTo.data.result.address_components[0].long_name)
            const newObj = {
              place_name : responseTo.data.result.address_components[0].long_name,
              formatted_address : responseTo.data.result.formatted_address,
              location : responseTo.data.result.geometry.location,
          
              boundaryRight : responseTo.data.result.geometry.viewport.northeast,
              boundaryLeft : responseTo.data.result.geometry.viewport.southwest,
              photos : photosT,
              place_id : responseTo.data.result.place_id,
              rating : responseTo.data.result.rating,
              types : responseTo.data.result.types,
              url : responseTo.data.result.url,
              vicinity : responseTo.data.result.vicinity,
             summary: res.split('.').slice(0,3).join('.'),
             bestPlaces: bestPlaces, 
          }
          
          placesArray.push(newObj)
          }
  
    
  
  
   const finalTripName = 'Trip From ' + placesArray[0].place_name + ' to ' + placesArray[1].place_name
  const finalObj = {
    tripName: finalTripName,
    numberOfDays:totalDays,
    from: query.from,
    to: query.to,
    placesInfo : placesArray,
    startDate : startDate,
    endDate : endDate,
    

  }
  const createNewTrip = await this.tripModel.create({
    tripObj: finalObj

  })
  const user = await this.findByIp(ip);
if(user) {

   await this.userModel.findByIdAndUpdate(user._id, {
    $push: {
      trips: createNewTrip._id
    }
  })
  user.save()
  

}
else {
  const newUs = await this.createUserIp({
    "fName": ip,
    "lName": ip,
    "email": ip,
    "password": ip,
   "ip": ip
  })
  newUs.trips.push(createNewTrip._id);
  console.log(newUs)
}
  
    return createNewTrip;


  }
  async getWiki(name) {

    return wiki().page(name)
	
	
  
  }
  photosArray(photoarray) {
    const photosArray = []
    
    if(photoarray != undefined || photoarray != null)
    for (let i = 0; i < photoarray.length; i++) {
      const term = photoarray[i].photo_reference
      const width = photoarray[i].width
      const height = photoarray[i].height
     const urlPhoto = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${term}&maxheight=${height}&maxwidth=${width}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`;
      
      photosArray.push(urlPhoto);
      
      
    }
    return photosArray;
  }
  async nearbyHotels(query) {

    return 
  }
individualDays(days,places) {
const final = []
  if(days/places >= 1) {
    if(days % places === 0) {
    const number = Math.floor(days/places)
    for (let i = 0; i < places; i++) {
      final.push(number)
      
    }
  }
  else {

  }
}
  else if (days/places < 1) {
    return 1
  }

  


}
 divvy(number, parts) {

  var randombit = number - 1 * parts;
  var out = [];
  
  for (var i=0; i < parts; i++) {
    out.push(Math.random());
  }
  
  var mult = randombit / out.reduce(function (a,b) {return a+b;});

  return out.map(function (el) { return Math.round(el * mult + 1) });
}

// async newTrip(ip, response) {

//   const newTrip = await this.tripModel.create({
//     unique_id: ip,
//     trips: response

//   })
//   return newTrip.save();

// }

  // async fileupload(uid: string, @Req() req, @Res() res) {
  //   const user = await this.userModel.findById(uid);
  //   try {
  //     this.upload(req, res, function(error) {
  //       if (error) {
  //         return res.status(404).json(`Failed to upload image file: ${error}`);
  //       }
  //       user.imgpath = req.files[0].location;

  //       user.save();

  //       return res.status(201).json(req.files[0].location);
  //     });
  //   } catch (error) {
  //     return res.status(500).json(`Failed to upload image file: ${error}`);
  //   }
  // }
  
  /**
   * * Find specific Users by their email id.
   * @param email : Accepts user's email id of type string.
   * @returns: A Promise of type 'User'.
   */
async newTrip(tripObj) {
  return await (await this.tripModel.create({
    tripObj: tripObj
  })).save();
}

  async findById(uid: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel
        .findById(uid)
        .populate(user)
        .exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }

    if (!user) return null;

    return sanitizeUser(user);
  }
  // async findByIp(ip: string) {
  //   let trip: Trip;
  //   try {
  //     trip = await this.tripModel.findOne({unique_id: ip})
        
  //       .populate(trip)
  //       .exec();
  //   } catch (error) {
  //     throw new NotFoundException('Could not find the specified Trip');
  //   }

  //   if (!trip) return null;

  //   return trip;
  // }
  // async addToTrips(ip, response ) {
  //   const trip = await this.findByIp(ip)
  //  trip.trips.push(response)

  //  return trip.save()
  // }

  // async findTripsById() {

  // }
  async checkFb(fbid: string) {
    //   const user = await this.findByFbid(fbid);
    // console.log(user)
    //   if(!user) {
    //     return false
    //   }
    //   else {
    //     return user.save()
    //   }
    let user: User;
    try {
      user = await this.userModel.findOne({ fbid: fbid });

      if (user != null) {
        return true;
      }
    } catch (error) {
      throw new NotFoundException('User Not found!');
    }
    return user;
  }


  async findByEmail(email: any): Promise<User> {
    let user: User;

    try {
      user = await this.userModel
        .findOne({
          email: email,
        })
        .populate(user)
        .exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }
    return user;
  }
  async findByIp(ip: any): Promise<User> {
    let user: User;

    try {
      user = await this.userModel
        .findOne({
          ip: ip,
        })
        .populate(user)
        .exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }
    return user;
  }

  async findTripById(id: any): Promise<Trip> {
    let trip: Trip;

    try {
      trip = await this.tripModel
        .findOne({
          _id: id,
        })
        .populate(trip)
        .exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }
    return trip;
  }


  async findByFbid(fbid: string): Promise<User> {
    const user = await this.userModel.findOne({
      fbid: fbid,
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async findByEmailObject(email: any): Promise<User> {
    let user: User;

    try {
      user = await this.userModel
        .findOne({
          email: email.email,
        })
        .populate(user)
        .exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }
    return user;
  }

  /**
   * * Find specific Users through the authentication credentials issued against their profile. Typically used by Auth Services to verify a returning user.
   * @param uid : Accepts user id of type 'string'.
   * @param authToken : Accepts authentication token of type 'string'.
   * @returns: A Promise of type 'User'.
   */

  async findByAuthCredentials(uid: string, authToken: string) {
    return await this.userModel.findOne({
      _id: uid,
      'access_tokens.token': authToken,
    });
  }

  /**
   *  Used to find all users present in the current database. FOR ADMIN USE ONLY.
   * @returns: A Promise of type 'User[]'.
   */

  async findAll(): Promise<User[]> {
    const users = await this.userModel
      .find({ isDeactivated: { $ne: true } })
      .populate('appliedJobPosts')
      .exec();
    users.forEach(user => sanitizeUser(user));

    return users;
  }

  /**
   * * Finds specific users and updates their profile, if the required updating criterion are fulfilled.
   * @param uid : Accepts user id of type 'string'.
   * @param user Accepts user object of type 'any'.
   * @returns: A Promise of type 'User'.
   */

  async updateById(uid: string, user): Promise<User> {
    let updatedUser: User;
    const allowedUpdates = ['fName', 'lName', 'email', 'phoneNum'];
    const requestedUpdates = Object.keys(user);

    const isValidUpdate = requestedUpdates.every(update =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate)
      throw new ForbiddenException('Invalid Updates Requested');

    try {
      updatedUser = await this.userModel.findById(uid).exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }

    requestedUpdates.forEach(update => (updatedUser[update] = user[update]));
    const updatedUserAfterSave = await updatedUser.save();
    return sanitizeUser(updatedUserAfterSave);
  }

  async updateTripById(uid: string, user): Promise<User> {
    let updatedUser: User;
    const allowedUpdates = ['fName', 'lName', 'email', 'phoneNum'];
    const requestedUpdates = Object.keys(user);

    const isValidUpdate = requestedUpdates.every(update =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate)
      throw new ForbiddenException('Invalid Updates Requested');

    try {
      updatedUser = await this.userModel.findById(uid).exec();
    } catch (error) {
      throw new NotFoundException('Could not find the specified User');
    }

    requestedUpdates.forEach(update => (updatedUser[update] = user[update]));
    const updatedUserAfterSave = await updatedUser.save();
    return sanitizeUser(updatedUserAfterSave);
  }

  /**
   * * Finds specific Users and removes their profile, if necessary.
   * @param uid : Accepts user id of type 'string'.
   * @returns: A Promise of type 'void'.
   */

  async removeById(uid: string): Promise<User[]> {
    if (!uid) throw new BadRequestException('Not a valid User Id');
    const user = await this.userModel.findById(uid);
    const transfer = await this.userDuplicateModel.insertMany([user]);

    const res = await this.userModel
      .deleteOne({
        _id: uid,
      })
      .exec();

    if (!res.deletedCount)
      throw new NotFoundException('Could not delete the specified User');
    return transfer;
  }
  // async awsfileUpload(@Req() req, @Res() res) {
  //   this.upload(req, res, function(error) {
  //     if (error) {
  //       return res.status(404).json(`Failed to upload image file: ${error}`);
  //     }
  //     const fileAddress = req.files[0].location;

  //     return res.status(201).json(req.files[0].location);
  //   });
  // }
  async upgradeToEnterprise(uid: string): Promise<User> {
    if (!uid) throw new BadRequestException('Invalid Id');

    let user: User;
    // eslint-disable-next-line prefer-const
    user = await this.userModel.findById(uid);

    if (!user) throw new NotFoundException('Could not find the specific user');

    if (user.role === 'enterprise')
      throw new BadRequestException('Account already upgraded');

    user.role = 'enterprise';
    const upgradedUser = await user.save();
    return sanitizeUser(upgradedUser);
  }
}
