const fs = require('fs')
const path = require('path')

function checkFileType(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (eror, stats) => {
      if (eror) {
        console.warn('获取文件stats失败')
        reject()
      } else {
        const isFile = stats.isFile()//是文件
        const isDir = stats.isDirectory()//是文件夹
        resolve({
          isFile,
          isDir
        })
      }
    })
  })
}

function getDirectoryFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        console.warn(err)
        reject()
      } else {
        resolve(files)
      }
    })
  })
}

function getFileList(filePath) {
  return new Promise((resolve, reject) => {
    getDirectoryFiles(filePath).then(files => {
      const promises = files.map(async (filename) => {
        return new Promise((resolve) => {
          const filedir = path.join(filePath, filename)
          checkFileType(filedir).then(fileType => {
            if (fileType.isFile) {
              resolve({
                sort: parseInt(path.basename(filedir)) || 999999,
                name: path.basename(filedir),
                path: filedir.replace(process.cwd(), '')
              })
            }
            if (fileType.isDir) {
              resolve(getFileList(filedir))
            }
          })
        })
      })
      resolve(Promise.all(promises))
    })
  })
}

function generateFileTemplate(template, file) {
  return template.replace('$name', file.name).replace('$path', file.path)
}

async function generateSidebarFile(files) {
  let text = ''
  files.sort((a, b) => a.sort - b.sort)
  files.forEach(file => {
    text += generateFileTemplate(`* [$name]($path)\n`, file)
  })
  fs.writeFileSync(path.join(process.cwd(), './_sidebar.md'), text)
}

async function generateReadmeFile(files) {
  let text = `# LeetCode
?> 给自己定个小目标，一周最少一更，哇咔咔咔咔咔

## 现有文章\n`
  files.sort((a, b) => a.sort - b.sort)
  files.forEach(file => {
    text += generateFileTemplate(`- [$name]($path)\n`, file)
  })
  fs.writeFileSync(path.join(process.cwd(), './README.md'), text)
}

async function main (basePath) {
  let files = await getFileList(basePath)
  files = files.flat().filter(ele => ele.name !== 'README.md')
  await generateSidebarFile(files)
  await generateReadmeFile(files)
}
module.exports = main
