var fs = require('fs');

fs.readFile("phonelisting.json", function (err, val) {
    if (err) {
        console.error("unable to read file");
    }
    else {
        try {
            val = JSON.parse(val);
            for (let phone of val) {
                phone.image = "/img/" + phone.brand + ".jpeg"
            }
            fs.writeFileSync('phonelisting_processed.json', JSON.stringify(val, null, 4))
        }
        catch (e) {
            console.error("invalid json in file");
        }
    }
});

