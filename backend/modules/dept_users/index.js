
let router = require('express').Router();

const validateToken = require('../../utils').validateToken;
const UsersInDepartment = require('../../models/usersInDepartment')

// Сотрудники в отделах клиента
router.get('/:client_id', validateToken, (req,res) => {
  UsersInDepartment.find({client_id: req.params.client_id}, (err, users_in_depts) => {
      if (err) return res.status(500).send("Error during getting employees in departments");
      if (users_in_depts == null)
          res.status(404).send("No users in depts for client "+req.params.client_id)
      else
          res.status(200).send(users_in_depts) 
  })
})

// Добавление сотрудников в отдел клиента
router.post('/:client_id/:dept_id', (req,res) => {
  // пытаемся найти запись о сотрудниках данного отдела
  UsersInDepartment.findOne({...req.params}, (err, users_in_dept) => {
      if (err) return res.status(500).send("Error during find employees in department");
      // если не нашли - создаем новую запись
      if (users_in_dept == null)
          UsersInDepartment.create({
              ...req.params,
              users: req.body.users, // список сотрудников должен быть передан в теле
              headUser: ""
          }, (err,data) => {
              if (err) return res.status(500).send('Error of create employees in dept: '+err)
              res.status(200).send(data)
          })
          //res.status(404).send("No users in depts for client "+req.params.client_id)
      else {
          users_in_dept.users = [...new Set(users_in_dept.users.concat(req.body.users))] // trick for unduplicate itemsafter concat
          UsersInDepartment.findOneAndUpdate({...req.params}, users_in_dept, {new: true}, (err, data) => {
              if (!err) res.status(200).send(data)
              else res.status(500).send("Error when update emloyees for dept "+req.params.dept_id+": "+err)
          })
      }
  })
})

// удаление сотрудника из отдела
router.delete('/', (req,res)=>{
  // В теле должны быть указаны client_id, dept_id и user_id
  const q = {
      client_id: req.body.client_id, 
      dept_id: req.body.dept_id
  }
  
  UsersInDepartment.findOne(q, (err, dept_users)=>{
      if (err) return res.status(500).send("Error during find employees in department to delete one");
      if (dept_users == null) return res.status(404).send(`No data found by client id='${q.client_id}' and dept_id ='${q.dept_id}'`)

      const i = dept_users.users.indexOf(req.body.user_id)
      dept_users.users.splice(i,1)
      UsersInDepartment.findByIdAndUpdate(dept_users._id, dept_users, (err, data)=>{
          if (err) return res.status(500).send("Error during update employees in department after delete");
          res.status(200).send(data)
      })
  })
})

// установка начальника отдела
router.put('/', (req, res) => {
  // В теле должны быть указаны client_id, dept_id и user_id
  console.log(`edit dept_users API: ${JSON.stringify(req.body,null,2)}`);
  const q = {
      client_id: req.body.client_id, 
      dept_id: req.body.dept_id
  }
  UsersInDepartment.findOne(q, (err, dept_users)=>{
      if (err) return res.status(500).send("Error during find employees in department to set chief");
      dept_users.headUser = req.body.user_id
      UsersInDepartment.findByIdAndUpdate(dept_users._id, dept_users, (err, data)=>{
          if (err) return res.status(500).send("Error during set employee as chief in the department");
          res.status(200).send(data)
      })
  })
})

// удаление сотрудника из статуса начальника отделов при увольнении
router.put(`/clear_chief/:empl_id`, (req,res) => {
  console.log('clear ', req.params.empl_id);
  
  UsersInDepartment.updateMany({headUser: req.params.empl_id}, {headUser: ''}, (error, docs) => {
      if (error) res.status(500).send('Error while clearing chief:', error)
      else {
        console.log(`chief was cleared in ${docs.nModified} depts`);
        res.status(200).send(docs)
      }
  })
})

module.exports = router
