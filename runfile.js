import { run } from 'runjs'

export function test (opt) {
  if (opt === 'watch') {
    run('jest --watch')
  } else {
    lint()
    build()
    run('jest')
  }
}

export function lint (opt) {
  if (opt === 'fix') {
    run('eslint ./src --fix')
  }
  run('eslint ./src')
}

export function build () {
  run('babel src --out-dir lib --ignore test.js')
}

export function coverage () {
  run('jest --coverage')
}
