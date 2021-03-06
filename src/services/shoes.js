import axios from 'axios'
const baseUrl = 'https://jog-log--api.herokuapp.com/shoes'
// const baseUrl = 'http://joglog-env.eba-mdjdjcrp.us-east-2.elasticbeanstalk.com/shoes'

const addNew = async params => {

  const config = {
    headers: {Authorization: `Bearer ${params.token}`}
  }

  const bodyObject = {name: params.shoeName, user: params.user.no, }

  const response = await axios.post(baseUrl + '/new', bodyObject, config)

  return response.data
}

const exported = { addNew }

export default exported
