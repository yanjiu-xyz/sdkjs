# Deserializer

## Overview

**deserializer** allow you to automatically get deserialized stacktrace in errors

## How to use

* Create `input.txt` and put the errors there separated by one blank line
    ```
    Error

    Another error
    ```
* If the file contains several different versions, create the appropriate folders in the cache folder.\
For example
    ```
    cache/
        7.2.0-204
            sdk-all.props.js.map
        77.99.0-175
            word.props.js.map
            cell.props.js.map
            slide.props.js.map
        <version>-<build>
            <maps>
    ```
    **But if only one version is missing, it can be found automatically in build folder.**
* Run deserializer
    ```
    node deserializer.js
    ```
* The result of the execution will be in the `output.txt`

