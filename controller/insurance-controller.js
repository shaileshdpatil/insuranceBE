const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');

function getPosition(number) {
  const start = 10000;
  const increment = 1000;

  if (number < start || number > 75000 || (number - start) % increment !== 0) {
    return 'Number out of range or not valid.';
  }
  return ((number - start) / increment) + 1;
}

const getinsurancepackages = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Define the base URL of the API
    const baseUrl = 'https://grandiosesg-sandbox-sg.insuremo.com';

    // Append the endpoint to the base URL
    const apiUrl = `${baseUrl}/cas/ebao/v2/json/tickets`;

    // Data to be sent in the request body
    const requestData = {
      username: 'Grandiose.User',
      password: 'Grandiose@12'
    };

    // Make a POST request to the API with data in the request body
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'x-mo-client-id':"key",
        'x-mo-tenant-id':"grandiosesg",
        'x-mo-user-source-id':"platform",
      }
    });


    // Send the response back to the client
    const result = await sendRequest(response.data.access_token, req.body);
    res.status(200).json({ result: result });
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
    res.status(500).json({ message: "Error fetching insurance packages", error: error.message });
  }
}
const sendRequest = async (authToken, request) => {
  const { enginecapacity, suminsured , PlanType , startDate } = request;

  try {
    const apiUrl = 'https://sandbox-sg-gw.insuremo.com/grandiosesg/1.0/pa-bff-app/v1/policy/application';
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const requestData = {
      "ProductCode": "VPC001",
      "ProductVersion": "1.0",
      "EffectiveDate": startDate ? startDate : formattedDate,
      "ExpiryDate": "2025-04-25",
      "PlanType": PlanType,
      "PolicyCustomerList": [
        {
          "ProposerName": "Customer Name",
          "IsInsured": "Y",
          "IsPolicyHolder": "Y",
          "IsOrgParty": "Y",
          "Mobile": "1234567876",
          "Email": "test@test.com",
          "Address": "Test",
          "Occupation": "Doctor",
          "Phone": "1234567"
        }
      ],
      "PolicyLobList": [
        {
          "ProductCode": "VPC001",
          "PolicyRiskList": [
            {
              "ProductElementCode": "R00004",
              "EngineNo": "PK12344444444",
              "Make": "317",
              "Model": "37222",
              "ManufactureDate": "2021-09-08",
              "ChassisNo": "CN1122222333",
              "RegistrationNo": "MK12322222",
              "EngineCapacity": enginecapacity,
              "IsVehiclePurchaseWithTaxAllowance": "Y",
              "IsVehiclePartAlteredFromOriginalSpec": "Y",
              "DetailsOfAlteredVehicleSpec": "fdsfdsfsdf",
              "InLast3YearsAnyLossesOrClaim": "N",
              "ClaimsDescription": "",
              "VehicleDrivenBy": "fdsfdsf",
              "LicenseRevoked": "Y",
              "LicenseRevokedReason": "fsdfdsf",
              "VehicleUsed24Hrs": "Y",
              "DoYouHaveALoanOrFinanceOnThisVehicle": "Y",
              "WorkingHrsIncludeTravelToFromWork": "Y",
              "WithinPhnomPenh": "Y",
              "SocialDomesticPleasure": "Y",
              "InConnectionOccupationBusiness": "Y",
              "Other": "fdsfdsf",
              "PlaceOfVehicleParkedAtNight": "fdsfdsf",
              "VehicleParked": "fdsfdsf",
              "IsYourCarWellMaintained": "fdsfdsf",
              "CommercialAdPaintVehicle": "Y",
              "PaintingValue": "1000",
              "DiscountType": "NCD",
              "SumInsuredOption": getPosition(suminsured),
              "DriverExperience": "5",
              "DrivingLicenceType": "LIGHT",
              "PrevInsuranceList": [
                {
                  "IsCurrentPolicyAvailable": "Y",
                  "PreviousPolicyInsuranceCompany": "DIGIT",
                  "PrevPolicyExpiryDate": "2021-09-08",
                  "PrevPolicyNCB": "20"
                }
              ]
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