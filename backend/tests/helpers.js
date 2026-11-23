const fs = require('fs');
const os = require('os');
const path = require('path');

// Her test dosyası kendi geçici veritabanını kullansın, gerçek data/db.json'a dokunmasın
function useTempDb() {
  const file = path.join(os.tmpdir(), `auth-test-${process.pid}-${Date.now()}.json`);
  process.env.DB_FILE = file;
  process.env.NODE_ENV = 'test';
  return () => fs.rmSync(file, { force: true });
}

module.exports = { useTempDb };
