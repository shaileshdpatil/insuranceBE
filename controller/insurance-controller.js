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
      "ProductCode": "VPC001",
      "ProductVersion": "1.0",
      "EffectiveDate": "2024-04-26",
      "ExpiryDate": "2025-04-25",
      "PlanType": "COMP",
      "PolicyCustomerList": [
        {
          "ProposerName": "Customer Name",
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
          "ProductElementCode": "VPC001",
          "SumInsured": suminsured,
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
              "SumInsuredOption": "1",
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