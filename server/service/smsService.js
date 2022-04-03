const axios = require('axios');

class SmsService {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async sendSms(phoneNumber, messageCode, login, password) {
            const randomNumber = (startInt, endInt) => (Math.floor(Math.random()*(endInt-startInt))+startInt);
            const basicToken = Buffer.from(`${login}:${password}`).toString('base64');
            const currentAddrSMS = randomNumber(31, 42);
            await axios.post(`http://10.10.${currentAddrSMS}.1/api/sendsms`,
                        {recipient:phoneNumber, message:messageCode},
                        {headers: {'Authorization': `Basic ${basicToken}`}});
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    generateNumberForMessage(numberOfSymbols) {
        let genNumber = Math.floor(Math.random()*Math.pow(10,numberOfSymbols));
        if (genNumber.toString().length < numberOfSymbols) {
            const numberOfNeedSymbols = numberOfSymbols - genNumber.toString().length;
            genNumber *= Math.pow(10, numberOfNeedSymbols);
        }
        return genNumber;
    }
}

module.exports = new SmsService();