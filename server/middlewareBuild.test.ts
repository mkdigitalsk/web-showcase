import { resolve } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

/**
 * Vercel runs `middleware.ts` as Node ES modules, compiled file by file, so a relative import without its extension
 * resolves at the edge to a path that does not exist — `ERR_MODULE_NOT_FOUND`, a 500 on every request, while every
 * local tool (Vite, Vitest, `tsc` in bundler mode) resolves it happily. Compiling the graph under `nodenext` is the
 * one check that sees what the platform sees.
 */
function nodeEsmDiagnostics(entry: string): string[] {
  const program = ts.createProgram([resolve(entry)], {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ES2023,
    types: ['node'],
    skipLibCheck: true,
    noEmit: true,
  })
  return ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
}

describe('the middleware as the platform runs it', () => {
  it('resolves every module it imports as a Node ES module', () => {
    expect(nodeEsmDiagnostics('middleware.ts')).toEqual([])
  }, 30_000)
})
