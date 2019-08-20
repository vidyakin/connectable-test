db = db.getSiblingDB('connectable')
db.createCollection('init')

db.createUser(
    {
        user: "admin",
        pwd: "password",
        roles:[
            {
                role: "readWrite",
                db:   "connectable"
            }
        ]
    }
)