import { run } from 'runjs'

export function test (opt) {
  if (opt !== 'e2e') {
    lint()
    build()
    run('jest')
  }

  if (opt !== 'fast') {
    run('sh src/e2e.test.sh')
  }
}

export function lint (opt) {
  if (opt === 'fix') {
    run('eslint ./src --fix')
  }
  run('eslint ./src')
}

export function build () {
  run('babel src --out-dir . --ignore test.js')
}

export function coverage () {
  run('jest --coverage')
}
