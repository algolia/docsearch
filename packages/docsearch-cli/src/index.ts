#!/usr/bin/env node
/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { runCli } from './cli.js';

process.exitCode = await runCli();
