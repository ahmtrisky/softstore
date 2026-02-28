import { createHash } from 'crypto'

// Test password hash
const password = 'admin123'
const hash = createHash('sha256').update(password).digest('hex')

console.log('Testing password:', password)
console.log('Hash result:', hash)
console.log('Expected:     ', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')
console.log('Match:', hash === '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')
