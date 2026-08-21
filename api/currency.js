const COUNTRY_CURRENCY = {
  AD:"EUR",AE:"AED",AF:"AFN",AG:"XCD",AI:"XCD",AL:"ALL",AM:"AMD",AO:"AOA",AR:"ARS",AS:"USD",AT:"EUR",AU:"AUD",AW:"AWG",AX:"EUR",AZ:"AZN",
  BA:"BAM",BB:"BBD",BD:"BDT",BE:"EUR",BG:"BGN",BH:"BHD",BI:"BIF",BJ:"XOF",BM:"BMD",BN:"BND",BO:"BOB",BR:"BRL",BS:"BSD",BW:"BWP",BY:"BYN",BZ:"BZD",
  CA:"CAD",CD:"CDF",CF:"XAF",CG:"XAF",CH:"CHF",CI:"XOF",CL:"CLP",CM:"XAF",CN:"CNY",CO:"COP",CR:"CRC",CZ:"CZK",
  DE:"EUR",DK:"DKK",DO:"DOP",DZ:"DZD",EC:"USD",EE:"EUR",EG:"EGP",ES:"EUR",ET:"ETB",
  FI:"EUR",FJ:"FJD",FR:"EUR",GB:"GBP",GE:"GEL",GH:"GHS",GR:"EUR",GT:"GTQ",HK:"HKD",HN:"HNL",HR:"EUR",HU:"HUF",
  ID:"IDR",IE:"EUR",IL:"ILS",IN:"INR",IQ:"IQD",IS:"ISK",IT:"EUR",JM:"JMD",JO:"JOD",JP:"JPY",
  KE:"KES",KG:"KGS",KH:"KHR",KR:"KRW",KW:"KWD",KZ:"KZT",LA:"LAK",LB:"LBP",LK:"LKR",LT:"EUR",LU:"EUR",LV:"EUR",
  MA:"MAD",MD:"MDL",ME:"EUR",MG:"MGA",MK:"MKD",MM:"MMK",MN:"MNT",MX:"MXN",MY:"MYR",MZ:"MZN",
  NG:"NGN",NL:"EUR",NO:"NOK",NP:"NPR",NZ:"NZD",OM:"OMR",PA:"PAB",PE:"PEN",PH:"PHP",PK:"PKR",PL:"PLN",PT:"EUR",PY:"PYG",
  QA:"QAR",RO:"RON",RS:"RSD",RU:"RUB",RW:"RWF",SA:"SAR",SE:"SEK",SG:"SGD",SI:"EUR",SK:"EUR",TH:"THB",TR:"TRY",TW:"TWD",
  UA:"UAH",UG:"UGX",US:"USD",UY:"UYU",UZ:"UZS",VN:"VND",ZA:"ZAR",ZM:"ZMW"
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const country = String(req.headers["x-vercel-ip-country"] || "").toUpperCase();
  const localCurrency = COUNTRY_CURRENCY[country] || "EUR";
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/EUR", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Exchange rate request failed");
    const data = await response.json();
    if (data.result !== "success" || !data.rates?.EUR) throw new Error("Exchange rates unavailable");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=172800");
    return res.status(200).json({ base:"EUR", country, currency:data.rates[localCurrency]?localCurrency:"EUR", rates:data.rates, estimated:true });
  } catch (error) {
    console.error("Currency rates error:", error);
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.status(200).json({ base:"EUR", country, currency:"EUR", rates:{EUR:1}, estimated:true });
  }
}
