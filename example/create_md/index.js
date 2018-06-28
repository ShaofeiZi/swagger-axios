const http = require('http')
const fs = require('fs')
const path = require('path')

const Handlebars = require('handlebars')

const swaggerConfig = require('../../swaggerConfig.json')

const mdTemplate = fs.readFileSync(path.join(__dirname, 'template/md.hbs'), 'utf-8')
const method = fs.readFileSync(path.join(__dirname, 'template/method.hbs'), 'utf-8')
const parse = require('../../lib/parse.js')

Handlebars.registerPartial('method', method)
Handlebars.registerHelper('requireFilter', function (require) {
  return require ? 'required' : 'optional'
})

function main () {
  const URL = swaggerConfig.URL
  const output = swaggerConfig.output + 'api.md'
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
        const yamlResult = Handlebars.compile(mdTemplate)(data)
        fs.writeFileSync(path.join(output), yamlResult)
      })
    })
  }
}

main()
