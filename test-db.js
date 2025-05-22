const { Pool } = require('pg');
require('dotenv').config();

console.log('=== Test de connexion PostgreSQL ===');
console.log('Paramètres de connexion:');
console.log('- User:', process.env.DB_USER);
console.log('- Host:', process.env.DB_HOST);
console.log('- Database:', process.env.DB_DATABASE);
console.log('- Port:', process.env.DB_PORT);
console.log('- Password:', process.env.DB_PASSWORD ? '[DÉFINI]' : '[NON DÉFINI]');
console.log('=====================================');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    console.log('Tentative de connexion...');
    const client = await pool.connect();
    console.log('✅ Connexion à la base de données réussie !');
    
    const result = await client.query('SELECT NOW(), version()');
    console.log('✅ Test query réussie');
    console.log('- Heure actuelle:', result.rows[0].now);
    console.log('- Version PostgreSQL:', result.rows[0].version);
    
    client.release();
    await pool.end();
    console.log('✅ Connexion fermée proprement');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('❌ Code d\'erreur:', error.code);
    
    if (error.code === '28P01') {
      console.log('\n💡 Suggestion: Le mot de passe est incorrect');
      console.log('   Vérifiez votre mot de passe PostgreSQL dans pgAdmin');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggestion: PostgreSQL n\'est pas démarré ou le port/host est incorrect');
      console.log('   Vérifiez que PostgreSQL est en cours d\'exécution');
    } else if (error.code === '3D000') {
      console.log('\n💡 Suggestion: La base de données n\'existe pas');
      console.log('   Créez la base de données "crud_app" dans pgAdmin');
    }
    
    process.exit(1);
  }
}

testConnection();