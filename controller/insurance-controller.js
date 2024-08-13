const mongoose = require('mongoose');
const axios = require('axios');
const apiUrl = process.env.INURL;
const getinsurancepackages = async (req, res) => {
  const { enginecapacity, suminsured } = req.body;
  console.log(suminsured);
  
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Define the base URL of the API
    const baseUrl = 'https://grandiosesg-gimc.insuremo.com';

    // Append the endpoint to the base URL
    const apiUrl = `${baseUrl}/v1/json/tickets`;

    // Data to be sent in the request body
    const requestData = {
      username: 'Grandiose.User1',
      password: 'Grandiose@2023'
    };

    // Make a POST request to the API with data in the request body
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });


    // Send the response back to the client
    const result = await sendRequest(response.data.access_token, enginecapacity, suminsured);
    res.status(200).json({ result: result });
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
    res.status(500).json({ message: "Error fetching insurance packages", error: error.message });
  }
}
const sendRequest = async (authToken, enginecapacity, suminsured) => {
  try {
    // Define the API URL
    const apiUrl = 'https://grandiosesg-gimc.insuremo.com/proposal/v1/application';

    // Data to be sent in the request body
    const requestData = {
      "ProductCode": "VPC0001",
      "ProductVersion": "1.0",
      "VehicleType": "2",
      "EffectiveDate": "2022-12-26",
      "ExpiryDate": "2023-12-25",
      "PolicyCustomerList": [
        {
          "ProposerName": "ProposerName",
          "NRCNo": 1111,
          "BuildingHouseName": "xxx",
          "StreetName": "ssaf",
          "Township": "Township",
          "City": "City",
          "State": "State",
          "CountryCode": "CountryCode",
          "Mobile": 9999999,
          "Email": "Email",
          "ContactFax": "FaxNo",
          "Occupation": "Occupation"
        }
      ],
      "PolicyLobList": [
        {
          "ProductCode": "VPC0001",
          "PolicyRiskList": [
            {
              "ProductElementCode": "R00004",
              "RegistrationNo": "RegistrationNo",
              "MakeAndModel": "MakeAndModel",
              "TypeofBody": "TypeofBody",
              "YearofManufacture": "2023-12-25",
              "NoOfSeats": 6,
              "EngineNo": "EngineNo",
              "ChassisNo": "ChassisNo",
              "CubicCapacity": 15001,
              "VehicleValue": 5000,
              "Trailer": 1000,
              "LeaseCompany": "LeaseCompany",
              "PlotNo": "PlotNo",
              "BuildingHouseName": "BuildingHouseName",
              "StreetName": "StreetName",
              "Township": "Township",
              "City": "City",
              "IsEngineModified": "0",
              "PrevPolicyNo": "PrevPolicyNo",
              "PrevRegistrationNo": "RegistrationNo",
              "WillAnyoneDrive": "WillAnyoneDrive",
              "PrevDeclined": "1",
              "AnyPrevPremium": 1000,
              "AnyLoss": "AnyLoss",
              "PrevMarketValue": 1000,
              "PrevAgreementValue": "111",
              "PrevUnderInsured": "PrevUnderInsured",
              "PrevDate": "2022-12-26",
              "SumInsured": suminsured,
              "PolicyCoverageList": [
                {
                  "ProductElementCode": "BASIC"
                },
                {
                  "ProductElementCode": "C0000532"
                },
                {
                  "ProductElementCode": "WINDSC",
                  "WindScreenValue": 1000
                },
                {
                  "ProductElementCode": "SRCC01"
                },
                {
                  "ProductElementCode": "AOG01"
                },
                {
                  "ProductElementCode": "WARRSK"
                },
                {
                  "ProductElementCode": "BTRMNT"
                },
                {
                  "ProductElementCode": "THEFT"
                },
                {
                  "ProductElementCode": "DEDUCT"
                }
              ]
            }
          ],
          "PersonList": [
            {
              "DriverName": "DriverName",
              "DriverNRC": "DriverNRC",
              "DriverAge": "26",
              "DriverLicenseNo": "999",
              "DriverYear": "2022-12-26",
              "HasConvicted": "1",
              "DriverRelwithProposer": "DriverRelwithProposer"
            }
          ]
        }
      ]
    }

    // Make a POST request to the API with authentication token and data in the request body
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })
    const duePremium = response.data.DuePremium;
    const policyCoverageList = response.data.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList;
    return { duepremium: response.data, policycoverage: policyCoverageList };


  } catch (error) {
    // Handle errors
    console.error('Error sending request:', error);
    throw new Error('Failed to send request');
  }
};
module.exports = { getinsurancepackages, sendRequest };  