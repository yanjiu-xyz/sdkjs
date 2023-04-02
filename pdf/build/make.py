#!/usr/bin/env python

import sys
sys.path.append('../../../build_tools/scripts')
import base
import os

compilation_level = "WHITESPACE_ONLY"
#compilation_level = "SIMPLE_OPTIMIZATIONS"

if base.is_dir("./deploy"):
  base.delete_dir("./deploy")
base.create_dir("./deploy")

base.writeFile("./deploy/begin.js", "window[\"AscCommon\"] = window[\"AscCommon\"] || {};\n\n")

scripts_code = [
  "./deploy/begin.js",
  "./../../common/device_scale.js",
  "./../../common/browser.js",
  "./../../common/stringserialize.js",
  "./../../common/skin.js",
  "./../../common/libfont/loader.js",
  "./../../common/libfont/map.js",
  "./../../common/libfont/character.js",
  "./../../common/SerializeCommonWordExcel.js",
  "./../../common/Drawings/Externals.js",
  "./../../common/GlobalLoaders.js",
  "./../../common/scroll.js",
  "./../../common/Drawings/WorkEvents.js",
  "./../../common/Overlay.js",
  "./../src/thumbnails.js",
  "./../src/viewer.js",
  "./../src/file.js",
  "./api.js"
]

base.copy_file("./../src/engine/drawingfile.js", "./deploy/drawingfile.js")
base.copy_file("./../src/engine/drawingfile.wasm", "./deploy/drawingfile.wasm")
base.copy_file("./../src/engine/drawingfile_ie.js", "./deploy/drawingfile_ie.js")
base.copy_file("./../src/engine/cmap.bin", "./deploy/cmap.bin")

build_params = []
build_params.append("-jar")
build_params.append("../../build/node_modules/google-closure-compiler-java/compiler.jar")
build_params.append("--compilation_level")
build_params.append(compilation_level)
build_params.append("--js_output_file")
build_params.append("./deploy/viewer.js")

for item in scripts_code:
  build_params.append("--js")
  build_params.append(item)

base.cmd("java", build_params)

base.delete_file("./deploy/begin.js")
