const fs = require('fs')
const path = require('path')
const config = require('../project.config')
const basePath = path.join(__dirname, '../', config.postPath || '../articles')
console.log('basePath', basePath)

function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach((filename) => {
        //获取当前文件的绝对路径
        const filedir = path.join(filePath, filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, (eror, stats) => {
          if (eror) {
            console.warn('获取文件stats失败')
          } else {
            const isFile = stats.isFile()//是文件
            const isDir = stats.isDirectory()//是文件夹
            if (isFile) {
              const temps = filedir.split('.')
              const fileType = temps[temps.length - 1]
              if (fileType === 'md') {
                console.log(123123, filedir)
              }
            }
            if (isDir) {
              fileDisplay(filedir)//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}


const filesList = fileDisplay(basePath)
console.log(filesList)
