import { Transaction } from "sequelize";

import { GOOGLE_GEOCODING_API_KEY, STRIPE_SECRET_KEY, STRIPE_TAX_RATES } from "../config/config";
import { GoogleMaps } from "@bikairproject/google-api";
import { BatteriesModel, BikesModel, PaymentMethodsModel, TRIP_STATUS, TripsModel, TripStatusModel, UserSettings, UserSettingsModel,  UsersModel } from "@bikairproject/lib-manager";
import { Batteries, Bikes, PaymentMethods, STATUS, Trips, Users } from "@bikairproject/lib-manager";
import { GeoUtils } from "@bikairproject/lib-manager";
import { StripeApi } from "@bikairproject/stripe-api";

interface IParams {
    [key: string]: string | number
}

class TripData {
    private transaction: Transaction;
    private bike_name: string | null;
    private params: IParams | null;
    private userId: number;
    
    public stripeApi: any;
    public lat: number | undefined;
    public lng: number | undefined;
    public user: Users;
    public userSettings: UserSettings;
    public bike: Bikes;
    public battery: Batteries;
    public trip: Trips;
    public updatedTrip: Trips;
    public paymentMethod: PaymentMethods;
    public error: any;
    public address: string | null;


    constructor( 
        bike_name: string | null = null, 
        lat: number | undefined, lng: number | undefined, params: IParams | null, 
        userId: number, 
        transaction: Transaction)
    {
        this.transaction = transaction;
        this.bike_name = bike_name;
        this.lat = lat;
        this.lng = lng;

        this.params = params;
        this.userId = userId;
        this.error = null;
    }

    public async initStripe(){
        this.stripeApi = new StripeApi(STRIPE_SECRET_KEY, STRIPE_TAX_RATES);
    }

    public async setLat(lat: number | undefined){
        this.lat = lat;
    }

    public async setLng(lng: number | undefined){
        this.lng = lng;
    }

    public async canBeginTrip (){
        const hasTripAwaitForValidation = await TripsModel.findOne({
            where: {
                status: TRIP_STATUS.WAIT_VALIDATION,
                user_id: this.userId
            },
            transaction: this.transaction
        });
        if (hasTripAwaitForValidation) {
            console.log("User has a trip waiting for validation");
            await this.transaction.commit();
            this.error = {
                statusCode: 400,
                result: "NOT_ALLOWED_WAITING_FOR_VALIDATION"
            };
        }
    }

    public async setBikeById(){
        this.bike = await BikesModel.findByPk(this.trip.bike_id) as Bikes;
    }

    public async setBikeByName(){
        if(!this.bike_name){
            console.log("Missing bike_name parameter");
            await this.transaction.commit();
            this.error = {
                statusCode: 409,
                result: "MISSING_PARAMS"
            };
        }else{
            const bikeName = (this.bike_name as string).trim().toUpperCase();
            this.bike = await BikesModel.findOne({
                where: {
                    name: bikeName
                }}) as Bikes;
            if (!this.bike) {
                console.log(`Bike ${bikeName} not found.`);
                await this.transaction.commit();
                this.error =  {
                    statusCode: 404,
                    result: "BIKE_UNAVAILABLE"
                };
            }
        }
    }

    public async setUser(){
        this.user = await UsersModel.findByPk(this.userId) as Users;
        if (!this.user || this.user.is_block || !this.user.stripe_customer) {
            console.log(`User ${this.userId} is blocked`);
            await this.transaction.commit();
            this.error =  {
                statusCode: 400,
                result: "BLOCKED_USER"
            };
        }
        this.userSettings = await UserSettingsModel.findOne({where: {user_id: this.userId}}) as UserSettings;
    }

    public async setBattery(){
        this.battery = await BatteriesModel.findByPk(this.bike?.battery_id) as Batteries;
    }

    public async setTrip(status = ["OPEN", "WAIT_VALIDATION"]){
        const trip = await TripsModel.findOne({
            where: {
                user_id: this.user?.id,
                status: status
            }}) as Trips;
        if(!trip){
            await this.transaction.commit();
            this.error =  {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
        }
        this.trip = trip;
    }

    public async setTripById(){
        const trip = await TripsModel.findByPk(this.trip.id) as Trips;
        if(!trip){
            await this.transaction.commit();
            this.error =  {
                statusCode: 404,
                result: "TRIP_NOT_FOUND"
            };
        }
        this.trip = trip;
    }

    public async setPaymentMethod(){
        this.paymentMethod = await PaymentMethodsModel.findOne({
            where: {
                user_id: this.user?.id,
                status: STATUS.ACTIVE
            }}) as PaymentMethods;
        if (!this.paymentMethod) {
            console.log(`no payment method found for user ${this.user?.id}`);
            await this.transaction.commit();
            this.error =  {
                statusCode: 404,
                result: "MISSING_PM"
            };
        }
    }

    public async setAddress(lat: number, lng: number){
        if(!lat || !lng) return;
        this.address = await GeoUtils.reverseGeo(lat, lng);
        if (this.address === "NONE" && GOOGLE_GEOCODING_API_KEY) {
            try {
                const googleGeoCode = new GoogleMaps(GOOGLE_GEOCODING_API_KEY);
                this.address = await googleGeoCode.getAddress(lat, lng);
            } catch (error: any) {
                console.log(error);
            }
        }
    }

    public async createTripStatus(status: string){
        await TripStatusModel.create({
            status: status,
            trip_id: this.trip.id
        }, {
            transaction: this.transaction
        });
    }
}

export default TripData;
