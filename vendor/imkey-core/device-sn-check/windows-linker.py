#!/usr/bin/env python3
"""Link Rust 2023's GNU target with LLVM-MinGW's equivalent static runtimes."""
import os
import sys
from pathlib import Path

root = Path(os.environ["IMKEY_LLVM_MINGW_PATH"])
replacements = {
    "-lgcc_eh": root / "i686-w64-mingw32/lib/libunwind.a",
    "-lgcc": root / "lib/clang/16/lib/windows/libclang_rt.builtins-i386.a",
}
arguments = [str(replacements.get(argument, argument)) for argument in sys.argv[1:]]
os.execv(str(root / "bin/i686-w64-mingw32-clang"), ["i686-w64-mingw32-clang", *arguments])
