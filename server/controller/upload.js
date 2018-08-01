const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');

// 写入目录
const mkdirsSync = dirname => {
  if (fs.existsSync(dirname)) {
    return true;
  } else if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
  return false;
};

function getSuffix(fileName) {
  return fileName.split('.').pop();
}

// 重命名
function Rename(fileName) {
  return (
    Math.random()
      .toString(16)
      .substr(2) +
    '.' +
    getSuffix(fileName)
  );
}
// 删除文件
function removeTemImage(path) {
  fs.unlink(path, err => {
    if (err) {
      throw err;
    }
  });
}
// 上传到本地服务器
function uploadFile(ctx, options) {
  const _emmiter = new Busboy({ headers: ctx.req.headers });
  const fileType = options.fileType;
  const filePath = path.join(options.path, fileType);
  const confirm = mkdirsSync(filePath);
  if (!confirm) {
    return;
  }
  return new Promise((resolve, reject) => {
    _emmiter.on('file', (fieldname, file, filename) => {
      const fileName = Rename(filename);
      const saveTo = path.join(path.join(filePath, fileName));
      file.pipe(fs.createWriteStream(saveTo));
      file.on('end', function() {
        resolve({
          url: `static/${fileType}/${fileName}`,
          name: fileName,
        });
      });
    });
    _emmiter.on('error', function(err) {
      reject(err);
    });
    ctx.req.pipe(_emmiter);
  });
}

module.exports = {
  uploadImg: async (ctx, next) => {
    const serverPath = path.join(__dirname, '../public/static/');
    try {
        const result = await uploadFile(ctx, {
            fileType: 'cover',
            path: serverPath,
        });
        ctx.body = {
            status: 'success',
            data: result,
        };
    } catch (e) {
        ctx.body = {
            status: 'fail',
            data: e.stack
        };
    }

  },
};
