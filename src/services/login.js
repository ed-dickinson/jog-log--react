import axios from 'axios'
const baseUrl = 'https://jog-log--api.herokuapp.com/user'
// const baseUrl = 'http://joglog-env.eba-mdjdjcrp.us-east-2.elasticbeanstalk.com/user'

const login = async credentials => {

  const response = await axios.post(baseUrl + '/login', credentials)

  return response.data
}

const register = async details => {

  const response = await axios.post(baseUrl + '/new', details)

  return response.data
}

const exported = { login, register }

export default exported
