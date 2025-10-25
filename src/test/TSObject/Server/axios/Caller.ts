// const axios = require('axios'); // If you're using Node.js
import axios from "axios";
import { Str } from "../../Lib/TSExt/Str";
import { UserInfo } from "../../HandshakeModel/UserInfo";
import { App } from "../../ArchtectInfra/App";
import { DbContext } from "../../Stars-Whisper/DataModel/DbContext";
import { ModelFactory2, ModelFactory3 } from "../../Stars-Whisper/DataModel/ModelTree";
import { jwtDecode } from "jwt-decode";
import { AuthenticateResponse } from "../../HandshakeModel/AuthenticateResponse";

export const baseUrl = "https://localhost:8086";

export class Caller
{
    private static JWToken: string;

    public static userSignIn(username: string, password: string)
    {
        if(Str.isStringEmpty(username) || Str.isStringEmpty(password)){
            return;
        }

        let data = JSON.stringify({
            "username": username,
            "password": password
          });

        let authEndpoint = baseUrl + "/olitql/userSignIn";
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: authEndpoint,
            withCredentials: true, // Important for sending/receiving HTTP-only cookies
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
        
        axios.request(config)
            .then((response) => {
                let resp = <AuthenticateResponse> response.data;

                // let token = resp.Token;
                // let data = jwtDecode(jwtToken);

                if(resp.Success === true)
                {
                    let user = resp.Data;
                    // App.navigate("/main/menu/chart");
                    App.navigate("/main/menu");
                }
                

                // let str = JSON.stringify(data);
                // console.log(resp);
            })
            .catch((error) => {
                console.log(error);
            });
          
    }


    public static MakeDbContext()
    {
        let context = DbContext;
        let data = JSON.stringify(DbContext);
        let json = JSON.parse(data);

        let authEndpoint = baseUrl + "/schema";
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: authEndpoint,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
        
        axios.request(config)
            .then((response) => {
                let res = response.data;
                // console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
          
    }

    public static MakeTables()
    {
        let context = ModelFactory3(false);
        let data = JSON.stringify(context);
        let json = JSON.parse(data);

        let authEndpoint = baseUrl + "/schema";
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: authEndpoint,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
        
        axios.request(config)
            .then((response) => {
                let res = response.data;
                //console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
          
    }

    public static hasToken(): boolean{
        return Str.isStringValid(this.JWToken);
    }
}    