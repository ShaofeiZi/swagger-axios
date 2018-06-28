const http = require('http')

const swaggerConfig = require('../../swaggerConfig.json')

const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const apiTemplate = fs.readFileSync(path.join(__dirname, 'template/api.hbs'), 'utf-8')
const method = fs.readFileSync(path.join(__dirname, 'template/method.hbs'), 'utf-8')
const parse = require('../../lib/parse.js')
Handlebars.registerPartial('method', method)

function main () {
  const URL = swaggerConfig.URL
  const output = swaggerConfig.output + 'api.yaml'
  if (URL && output) {
    http.get(URL, function (req, res) {
      let swaggerData = ''
      req.on('data', function (data) {
        swaggerData += data
      })
      req.on('end', function () {
        const jsonData = JSON.parse(swaggerData)
        let opt = {
          swagger: jsonData,
          moduleName: 'api',
          className: 'api'
        }
        const data = parse(opt)
        let yamlResult = Handlebars.compile(apiTemplate)(data)
        fs.writeFileSync(path.join(output), yamlResult)
      })
    })
  }
}

main()
