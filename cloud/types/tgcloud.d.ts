/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable no-var */

/// <reference lib="es2015" />
/// <reference lib="es2018.asynciterable" />

/////////////////////////////
/// tgcloud APIs
/////////////////////////////

interface TextDecodeOptions {
  stream?: boolean
}

interface TextDecoderOptions {
  fatal?: boolean
  ignoreBOM?: boolean
}

interface TextEncoderEncodeIntoResult {
  read: number
  written: number
}

/**
 * The **`TextDecoder`** interface represents a decoder for a specific text encoding, such as UTF-8, ISO-8859-2, or GBK. A decoder takes an array of bytes as input and returns a JavaScript string.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder)
 */
interface TextDecoder extends TextDecoderCommon {
  /**
   * The **`TextDecoder.decode()`** method returns a string containing text decoded from the buffer passed as a parameter.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/decode)
   */
  decode(input?: AllowSharedBufferSource, options?: TextDecodeOptions): string
}

declare var TextDecoder: {
  prototype: TextDecoder
  new (label?: string, options?: TextDecoderOptions): TextDecoder
}

interface TextDecoderCommon {
  /**
   * Returns encoding's name, lowercased.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/encoding)
   */
  readonly encoding: string
  /**
   * Returns true if error mode is "fatal", otherwise false.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/fatal)
   */
  readonly fatal: boolean
  /**
   * Returns the value of ignore BOM.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/ignoreBOM)
   */
  readonly ignoreBOM: boolean
}

/**
 * The **`TextEncoder`** interface enables you to encode a JavaScript string using UTF-8.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder)
 */
interface TextEncoder extends TextEncoderCommon {
  /**
   * The **`TextEncoder.encode()`** method takes a string as input, and returns a Uint8Array containing the string encoded using UTF-8.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encode)
   */
  encode(input?: string): Uint8Array<ArrayBuffer>
  /**
   * The **`TextEncoder.encodeInto()`** method takes a string to encode and a destination Uint8Array to put resulting UTF-8 encoded text into, and returns an object indicating the progress of the encoding. This is potentially more performant than the encode() method — especially when the target buffer is a view into a Wasm heap.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encodeInto)
   */
  encodeInto(source: string, destination: Uint8Array<ArrayBufferLike>): TextEncoderEncodeIntoResult
}

declare var TextEncoder: {
  prototype: TextEncoder
  new (): TextEncoder
}

interface TextEncoderCommon {
  /**
   * Returns "utf-8".
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encoding)
   */
  readonly encoding: string
}

declare namespace WebAssembly {
  /**
   * A **`WebAssembly.Global`** object represents a global variable instance, accessible from both JavaScript and importable/exportable across one or more WebAssembly.Module instances. This allows dynamic linking of multiple modules.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Global)
   */
  interface Global<T extends ValueType = ValueType> {
    /**
     * The **`value`** property of the WebAssembly.Global object prototype returns the value contained inside the global variable.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Global/value)
     */
    value: ValueTypeMap[T]
    /** [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Global/valueOf) */
    valueOf(): ValueTypeMap[T]
  }

  var Global: {
    prototype: Global
    new <T extends ValueType = ValueType>(
      descriptor: GlobalDescriptor<T>,
      v?: ValueTypeMap[T],
    ): Global<T>
  }

  /**
   * A **`WebAssembly.Instance`** object is a stateful, executable instance of a WebAssembly.Module. Instance objects contain all the Exported WebAssembly functions that allow calling into WebAssembly code from JavaScript.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Instance)
   */
  interface Instance {
    /**
     * The **`exports`** read-only property of the WebAssembly.Instance object prototype returns an object containing as its members all the functions exported from the WebAssembly module instance, to allow them to be accessed and used by JavaScript.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Instance/exports)
     */
    readonly exports: Exports
  }

  var Instance: {
    prototype: Instance
    new (module: Module, importObject?: Imports): Instance
  }

  /**
   * The **`WebAssembly.Memory`** object is a resizable ArrayBuffer or SharedArrayBuffer that holds raw bytes of memory accessed by a WebAssembly.Instance.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Memory)
   */
  interface Memory {
    /**
     * The read-only **`buffer`** prototype property of the WebAssembly.Memory object returns the buffer contained in the memory. Depending on whether or not the memory was constructed with shared: true, the buffer is either an ArrayBuffer or a SharedArrayBuffer.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Memory/buffer)
     */
    readonly buffer: ArrayBuffer
    /**
     * The **`grow()`** prototype method of the WebAssembly.Memory object increases the size of the memory instance by a specified number of WebAssembly pages.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Memory/grow)
     */
    grow(delta: AddressValue): AddressValue
    toFixedLengthBuffer(): ArrayBuffer
    toResizableBuffer(): ArrayBuffer
  }

  var Memory: {
    prototype: Memory
    new (descriptor: MemoryDescriptor): Memory
  }

  /**
   * A **`WebAssembly.Module`** object contains stateless WebAssembly code that has already been compiled by the browser — this can be efficiently shared with Workers, and instantiated multiple times.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Module)
   */
  interface Module {}

  var Module: {
    prototype: Module
    new (bytes: AllowSharedBufferSource, options?: WebAssemblyCompileOptions): Module
    /**
     * The WebAssembly.**`Module.customSections()`** static method returns a copy of the contents of all custom sections in the given module with the given string name.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Module/customSections_static)
     */
    customSections(moduleObject: Module, sectionName: string): ArrayBuffer[]
    /**
     * The WebAssembly.**`Module.exports()`** static method returns an array containing descriptions of all the declared exports of the given Module.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Module/exports_static)
     */
    exports(moduleObject: Module): ModuleExportDescriptor[]
    /**
     * The WebAssembly.**`Module.imports()`** static method returns an array containing descriptions of all the declared imports of the given Module.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Module/imports_static)
     */
    imports(moduleObject: Module): ModuleImportDescriptor[]
  }

  /**
   * The **`WebAssembly.Table`** object is a JavaScript wrapper object — an array-like structure representing a WebAssembly table, which stores homogeneous references. A table created by JavaScript or in WebAssembly code will be accessible and mutable from both JavaScript and WebAssembly.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Table)
   */
  interface Table {
    /**
     * The read-only **`length`** prototype property of the WebAssembly.Table object returns the length of the table, i.e., the number of elements in the table.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Table/length)
     */
    readonly length: AddressValue
    /**
     * The **`get()`** prototype method of the WebAssembly.Table() object retrieves the element stored at a given index.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Table/get)
     */
    get(index: AddressValue): any
    /**
     * The **`grow()`** prototype method of the WebAssembly.Table object increases the size of the Table instance by a specified number of elements, filled with the provided value.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Table/grow)
     */
    grow(delta: AddressValue, value?: any): AddressValue
    /**
     * The **`set()`** prototype method of the WebAssembly.Table object mutates a reference stored at a given index to a different value.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Table/set)
     */
    set(index: AddressValue, value?: any): void
  }

  var Table: {
    prototype: Table
    new (descriptor: TableDescriptor, value?: any): Table
  }

  /**
   * The **`WebAssembly.Tag`** object defines a type of a WebAssembly exception that can be thrown to/from WebAssembly code.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Tag)
   */
  interface Tag {}

  var Tag: {
    prototype: Tag
    new (type: TagType): Tag
  }

  interface GlobalDescriptor<T extends ValueType = ValueType> {
    mutable?: boolean
    value: T
  }

  interface MemoryDescriptor {
    address?: AddressType
    initial: AddressValue
    maximum?: AddressValue
    shared?: boolean
  }

  interface ModuleExportDescriptor {
    kind: ImportExportKind
    name: string
  }

  interface ModuleImportDescriptor {
    kind: ImportExportKind
    module: string
    name: string
  }

  interface TableDescriptor {
    address?: AddressType
    element: TableKind
    initial: AddressValue
    maximum?: AddressValue
  }

  interface TagType {
    parameters: ValueType[]
  }

  interface ValueTypeMap {
    anyfunc: Function
    externref: any
    f32: number
    f64: number
    i32: number
    i64: bigint
    v128: never
  }

  interface WebAssemblyCompileOptions {
    builtins?: string[]
    importedStringConstants?: string | null
  }

  interface WebAssemblyInstantiatedSource {
    instance: Instance
    module: Module
  }

  type AddressType = 'i32' | 'i64'
  type ImportExportKind = 'function' | 'global' | 'memory' | 'table' | 'tag'
  type TableKind = 'anyfunc' | 'externref'
  type AddressValue = number
  type ExportValue = Function | Global | Memory | Table
  type Exports = Record<string, ExportValue>
  type ImportValue = ExportValue | number
  type Imports = Record<string, ModuleImports>
  type ModuleImports = Record<string, ImportValue>
  type ValueType = keyof ValueTypeMap
  var JSTag: Tag
  /** [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/compile_static) */
  function compile(
    bytes: AllowSharedBufferSource,
    options?: WebAssemblyCompileOptions,
  ): Promise<Module>
  /** [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/instantiate_static) */
  function instantiate(
    bytes: AllowSharedBufferSource,
    importObject?: Imports,
    options?: WebAssemblyCompileOptions,
  ): Promise<WebAssemblyInstantiatedSource>
  function instantiate(moduleObject: Module, importObject?: Imports): Promise<Instance>
  /** [MDN Reference](https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/validate_static) */
  function validate(bytes: AllowSharedBufferSource, options?: WebAssemblyCompileOptions): boolean
}

/** The **`console`** object provides access to the debugging console (e.g., the Web console in Firefox). */
/**
 * The **`console`** object provides access to the debugging console (e.g., the Web console in Firefox).
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console)
 */
interface Console {
  /**
   * The **`console.assert()`** static method writes an error message to the console if the assertion is false. If the assertion is true, nothing happens.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/assert_static)
   */
  assert(condition?: boolean, ...data: any[]): void
  /**
   * The **`console.clear()`** static method clears the console if possible.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/clear_static)
   */
  clear(): void
  /**
   * The **`console.count()`** static method logs the number of times that this particular call to count() has been called.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/count_static)
   */
  count(label?: string): void
  /**
   * The **`console.countReset()`** static method resets counter used with console.count().
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/countReset_static)
   */
  countReset(label?: string): void
  /**
   * The **`console.debug()`** static method outputs a message to the console at the "debug" log level. The message is only displayed to the user if the console is configured to display debug output. In most cases, the log level is configured within the console UI. This log level might correspond to the Debug or Verbose log level.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/debug_static)
   */
  debug(...data: any[]): void
  /**
   * The **`console.dir()`** static method displays a list of the properties of the specified JavaScript object. In browser consoles, the output is presented as a hierarchical listing with disclosure triangles that let you see the contents of child objects.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/dir_static)
   */
  dir(item?: any, options?: any): void
  /**
   * The **`console.dirxml()`** static method displays an interactive tree of the descendant elements of the specified XML/HTML element. If it is not possible to display as an element the JavaScript Object view is shown instead. The output is presented as a hierarchical listing of expandable nodes that let you see the contents of child nodes.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/dirxml_static)
   */
  dirxml(...data: any[]): void
  /**
   * The **`console.error()`** static method outputs a message to the console at the "error" log level. The message is only displayed to the user if the console is configured to display error output. In most cases, the log level is configured within the console UI. The message may be formatted as an error, with red colors and call stack information.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/error_static)
   */
  error(...data: any[]): void
  /**
   * The **`console.group()`** static method creates a new inline group in the Web console log, causing any subsequent console messages to be indented by an additional level, until console.groupEnd() is called.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/group_static)
   */
  group(...data: any[]): void
  /**
   * The **`console.groupCollapsed()`** static method creates a new inline group in the console. Unlike console.group(), however, the new group is created collapsed. The user will need to use the disclosure button next to it to expand it, revealing the entries created in the group.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/groupCollapsed_static)
   */
  groupCollapsed(...data: any[]): void
  /**
   * The **`console.groupEnd()`** static method exits the current inline group in the console. See Using groups in the console in the console documentation for details and examples.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/groupEnd_static)
   */
  groupEnd(): void
  /**
   * The **`console.info()`** static method outputs a message to the console at the "info" log level. The message is only displayed to the user if the console is configured to display info output. In most cases, the log level is configured within the console UI. The message may receive special formatting, such as a small "i" icon next to it.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/info_static)
   */
  info(...data: any[]): void
  /**
   * The **`console.log()`** static method outputs a message to the console.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/log_static)
   */
  log(...data: any[]): void
  /**
   * The **`console.table()`** static method displays tabular data as a table.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/table_static)
   */
  table(tabularData?: any, properties?: string[]): void
  /**
   * The **`console.time()`** static method starts a timer you can use to track how long an operation takes. You give each timer a unique name, and may have up to 10,000 timers running on a given page. When you call console.timeEnd() with the same name, the browser will output the time, in milliseconds, that elapsed since the timer was started.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/time_static)
   */
  time(label?: string): void
  /**
   * The **`console.timeEnd()`** static method stops a timer that was previously started by calling console.time().
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/timeEnd_static)
   */
  timeEnd(label?: string): void
  /**
   * The **`console.timeLog()`** static method logs the current value of a timer that was previously started by calling console.time().
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/timeLog_static)
   */
  timeLog(label?: string, ...data: any[]): void
  /** The **`console.timeStamp()`** static method adds a single marker to the browser's Performance tool (Firefox bug 1387528, Chrome). This lets you correlate a point in your code with the other events recorded in the timeline, such as layout and paint events. */
  timeStamp(label?: string): void
  /**
   * The **`console.trace()`** static method outputs a stack trace to the console.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/trace_static)
   */
  trace(...data: any[]): void
  /**
   * The **`console.warn()`** static method outputs a warning message to the console at the "warning" log level. The message is only displayed to the user if the console is configured to display warning output. In most cases, the log level is configured within the console UI. The message may receive special formatting, such as yellow colors and a warning icon.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/warn_static)
   */
  warn(...data: any[]): void
}

declare var console: Console

type AllowSharedBufferSource = ArrayBufferLike | ArrayBufferView<ArrayBufferLike>
