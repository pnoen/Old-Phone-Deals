var fs = require('fs');
var bcrypt = require('bcrypt');

var plainPass = "Apple123!";
var saltRounds = 5;

fs.readFile("userlist.json", async function (err, val) {
    if (err) {
        console.error("unable to read file");
    }
    else {
        try {
            val = JSON.parse(val);
            for (let user of val) {
                let hashedPass = await bcrypt.hash(plainPass, saltRounds);
                user.password = hashedPass;
            }
            fs.writeFileSync('userlist_processed1.json', JSON.stringify(val, null, 4))
        }
        catch (e) {
            console.log(e);
            console.error("invalid json in file");
        }
    }
});

