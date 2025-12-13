const sdk = require("node-appwrite");
const axios = require("axios");
const qs = require("qs");

module.exports = async function ({ req, res, log, error }) {
  let payload;
  try {
    payload = req.body ? JSON.parse(req.body) : {};
  } catch (err) {
    return res.json({ isValid: false, message: "Błąd danych wejściowych" });
  }

  const pwz = payload.licenseNumber;
  const firstName = payload.firstName;
  const lastName = payload.lastName;

  if (!pwz || !firstName || !lastName) {
    return res.json({ isValid: false, message: "Brak wymaganych danych" });
  }

  log(`Weryfikacja wstępna: ${firstName} ${lastName}, PWZ: ${pwz}`);

  try {
    const requestBody = qs.stringify({
      'op': 'lekarze',
      'nr_pwz': pwz,
      'imie': firstName,
      'nazwisko': lastName
    });

    const response = await axios.post(
      'https://wetsystems.org.pl/WetSystemsInfo/Bramka',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    const responseData = String(response.data);

    log("Otrzymana odpowiedź z WetSystems: " + responseData);
    const isVerified = true;

    if(responseData.includes("W bazie nie istnieje lekarz o podanych kryteriach wyszukiwania.")) {
      isVerified = false;
    }

    if (isVerified) {
      return res.json({ isValid: true });
    } else {
      return res.json({ isValid: false, message: "Nie znaleziono lekarza w rejestrze lub dane są błędne." });
    }

  } catch (err) {
    error("Błąd połączenia z WetSystems: " + err.message);
    return res.json({ isValid: false, message: "Błąd połączenia z rejestrem weterynarzy." });
  }
};