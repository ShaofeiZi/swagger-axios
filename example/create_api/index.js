const http = require('http')
const fs = require('fs')
const path = require('path')
const swaggerGen = require('../../index.js')

const swaggerConfig = require('../../swaggerConfig.json')

function main () {
  const URL = swaggerConfig.URL
  const output = swaggerConfig.output + 'api.js'
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
        const codeResult = swaggerGen(opt)
        fs.writeFileSync(path.join(output), codeResult)
      })
    })
  }
}

main()
