db = db.getSiblingDB('connectable')
db.createCollection('init')

var user = 'username'
var pass = 'password'

db.createUser(
    {
        user: `${user}`,
        pwd: `${pass}`,
        roles:[
            {
                role: "readWrite",
                db:   "connectable"
            }
        ]
    }
)