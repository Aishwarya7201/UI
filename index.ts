import express from 'express';
import cors from 'cors';
import https from 'https';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());//
app.use(express.static(path.join(__dirname, '../frontend')));

  const conversionRates: { [key: string]: number } = {
INR: 1,
AED: 0.043973,
AFN: 0.850874,
ALL: 1.109598,
AMD: 4.64928,
ANG: 0.021433,
AOA: 10.464939,
ARS: 10.994843,
AUD: 0.017753,
AWG: 0.021433,
AZN: 0.020369,
BAM: 0.02164,
BBD: 0.023947,
BDT: 1.407384,
BGN: 0.02164,
BHD: 0.004502,
BIF: 34.584906,
BMD: 0.011974,
BND: 0.01616,
BOB: 0.082693,
BRL: 0.065508,
BSD: 0.011974,
BTN: 1,
BWP: 0.162771,
BYN: 0.039134,
BZD: 0.023947,
CAD: 0.01633,
CDF: 33.944444,
CHF: 0.010772,
CLP: 11.219951,
CNY: 0.087227,
COP: 49.00869,
CRC: 6.325851,
CUP: 0.287369,
CVE: 1.220036,
CZK: 0.278514,
DJF: 2.127977,
DKK: 0.08254,
DOP: 0.707265,
DZD: 1.609904,
EGP: 0.574414,
ERN: 0.179605,
ETB: 0.691307,
EUR: 0.011065,
FJD: 0.026731,
FKP: 0.009363,
FOK: 0.082531,
GBP: 0.009363,
GEL: 0.033226,
GGP: 0.009363,
GHS: 0.185513,
GIP: 0.009363,
GMD: 0.766264,
GNF: 102.78335,
GTQ: 0.092945,
GYD: 2.504098,
HKD: 0.093571,
HNL: 0.296328,
HRK: 0.083366,
HTG: 1.58427,
HUF: 4.34469,
IDR: 194.911908,
ILS: 0.044194,
IMP: 0.009363,
IQD: 15.666667,
IRR: 507.789949,
ISK: 1.651889,
JEP: 0.009363,
JMD: 1.869196,
JOD: 0.008489,
JPY: 1.926078,
KES: 1.536848,
KGS: 1.035419,
KHR: 49.540541,
KID: 0.017753,
KMF: 5.443417,
KRW: 16.491561,
KWD: 0.003667,
KYD: 0.009978,
KZT: 5.731239,
LAK: 264.829156,
LBP: 1071.645512,
LKR: 3.65157,
LRD: 2.326308,
LSL: 0.218204,
LYD: 0.058312,
MAD: 0.118499,
MDL: 0.213656,
MGA: 53.911765,
MKD: 0.681533,
MMK: 33.858078,
MNT: 40.273767,
MOP: 0.096378,
MRU: 0.475918,
MUR: 0.562551,
MVR: 0.18452,
MWK: 20.89757,
MXN: 0.216727,
MYR: 0.056399,
MZN: 0.76528,
NAD: 0.218204,
NGN: 18.325416,
NIO: 0.440461,
NOK: 0.126517,
NPR: 1.6,
NZD: 0.019518,
OMR: 0.004604,
PAB: 0.011974,
PEN: 0.045461,
PGK: 0.04611,
PHP: 0.700952,
PKR: 3.335396,
PLN: 0.04742,
PYG: 90.157109,
QAR: 0.043584,
RON: 0.055075,
RSD: 1.295195,
RUB: 1.054852,
RWF: 16.265444,
SAR: 0.044901,
SBD: 0.101518,
SCR: 0.166069,
SDG: 5.351825,
SEK: 0.125771,
SGD: 0.01616,
SHP: 0.009363,
SLE: 0.271419,
SLL: 271.41871,
SOS: 6.839552,
SRD: 0.366563,
SSP: 26.350379,
STN: 0.271082,
SYP: 155.581792,
SZL: 0.218204,
THB: 0.437063,
TJS: 0.12914,
TMT: 0.04192,
TND: 0.037522,
TOP: 0.027945,
TRY: 0.391879,
TTD: 0.081001,
TVD: 0.017753,
TWD: 0.388177,
TZS: 32.022525,
UAH: 0.485869,
UGX: 44.246107,
USD: 0.011974,
UYU: 0.482305,
UZS: 151.027647,
VES: 0.437187,
VND: 307.358834,
VUV: 1.432801,
WST: 0.032328,
XAF: 7.257889,
XCD: 0.032329,
XDR: 0.009048,
XOF: 7.257889,
XPF: 1.320359,
YER: 2.997802,
ZAR: 0.218204,
ZMW: 0.292171,
ZWL: 0.163975
  };

async function convertFromINR(amount: number, toCurrency: string): Promise<number> {
  const url = 'https://open.er-api.com/v6/latest/INR';

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (dataP) => {
        data += dataP;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          const rates = jsonData.rates;

          if (!rates[toCurrency]) {
            reject(new Error(`Unsupported currency code: ${toCurrency}`));
            return;
          }

          const rate = rates[toCurrency];
          const convertedAmount = amount * rate;
          resolve(convertedAmount);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

app.post('/api/convert', async (req, res) => {
  const { amount, toCurrency } = req.body;

  try {
    const convertedAmount = await convertFromINR(amount, toCurrency);
    res.json({ convertedAmount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});

