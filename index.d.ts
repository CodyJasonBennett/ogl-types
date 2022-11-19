// Core
export interface CameraOptions {
  near: number
  far: number
  fov: number
  aspect: number
  left: number
  right: number
  bottom: number
  top: number
  zoom: number
}
export interface PerspectiveOptions extends Pick<CameraOptions, 'near' | 'far' | 'fov' | 'aspect'> {}
export interface OrthographicOptions
  extends Pick<CameraOptions, 'near' | 'far' | 'left' | 'right' | 'bottom' | 'top' | 'zoom'> {}
export class Camera extends Transform {
  near: number
  far: number
  fov: number
  aspect: number
  left: number
  right: number
  bottom: number
  top: number
  zoom: number
  projectionMatrix: Mat4
  viewMatrix: Mat4
  projectionViewMatrix: Mat4
  worldPosition: Vec3
  type: 'perspective' | 'orthographic'
  frustum: Vec3[]
  constructor(gl: OGLRenderingContext, options?: Partial<CameraOptions>)
  perspective(options?: Partial<PerspectiveOptions>): this
  orthographic(options?: Partial<OrthographicOptions>): this
  updateMatrixWorld(): this
  lookAt(target: Vec3): this
  project(v: Vec3): this
  unproject(v: Vec3): this
  updateFrustum(): void
  frustumIntersectsMesh(node: Mesh, worldMatrix?: Mat4): boolean
  frustumIntersectsSphere(center: Vec3, radius: number): boolean
}

export type AttributeMap = {
  [key: string]: Partial<Attribute>
}
export type Attribute = {
  size: number
  data: ArrayLike<number> | ArrayBufferView
  instanced?: null | number | boolean
  type: GLenum
  normalized: boolean
  target?: number
  id?: number
  buffer?: WebGLBuffer
  stride: number
  offset: number
  count?: number
  divisor?: number
  needsUpdate?: boolean
  usage?: number
}
export type Bounds = {
  min: Vec3
  max: Vec3
  center: Vec3
  scale: Vec3
  radius: number
}
export class Geometry {
  gl: OGLRenderingContext
  id: number
  attributes: AttributeMap
  VAOs: {
    [programKey: string]: WebGLVertexArrayObject
  }
  drawRange: {
    start: number
    count: number
  }
  instancedCount: number
  glState: RenderState
  isInstanced: boolean
  bounds: Bounds
  raycast?: 'sphere' | 'box'
  constructor(gl: OGLRenderingContext, attributes?: AttributeMap)
  addAttribute(key: string, attr: Partial<Attribute>): number
  updateAttribute(attr: Partial<Attribute>): void
  setIndex(value: Attribute): void
  setDrawRange(start: number, count: number): void
  setInstancedCount(value: number): void
  createVAO(program: Program): void
  bindAttributes(program: Program): void
  draw({ program, mode }: { program: Program; mode?: number }): void
  getPosition(): true | Partial<Attribute>
  computeBoundingBox(attr?: Partial<Attribute>): void
  computeBoundingSphere(attr?: Partial<Attribute>): void
  computeVertexNormals(): void
  normalizeNormals(): void
  remove(): void
}

export interface MeshOptions {
  geometry: Geometry
  program: Program
  mode: GLenum
  frustumCulled: boolean
  renderOrder: number
}
export interface DrawOptions {
  camera: Camera
}
export type MeshRenderCallback = (renderInfo: { mesh: Mesh; camera?: Camera }) => any
export interface RaycastHit {
  localPoint: Vec3
  distance: number
  point: Vec3
  faceNormal: Vec3
  localFaceNormal: Vec3
  uv: Vec2
  localNormal: Vec3
  normal: Vec3
}
export class Mesh extends Transform {
  name: string
  numInstances?: number
  gl: OGLRenderingContext
  id: number
  geometry: Geometry
  program: Program
  mode: GLenum
  frustumCulled: boolean
  renderOrder: number
  modelViewMatrix: Mat4
  normalMatrix: Mat3
  beforeRenderCallbacks: MeshRenderCallback[]
  afterRenderCallbacks: MeshRenderCallback[]
  hit: Partial<RaycastHit>
  constructor(gl: OGLRenderingContext, options?: Partial<MeshOptions>)
  onBeforeRender(f: MeshRenderCallback): this
  onAfterRender(f: MeshRenderCallback): this
  draw(options?: { camera?: Camera }): void
}

export type ProgramOptions = {
  vertex: string
  fragment: string
  uniforms: {
    [name: string]: {
      value: any
    }
  }
  transparent: boolean
  cullFace: GLenum | false
  frontFace: GLenum
  depthTest: boolean
  depthWrite: boolean
  depthFunc: GLenum
}
export interface BlendFunc {
  src?: GLenum
  dst?: GLenum
  srcAlpha?: number
  dstAlpha?: number
}
export interface BlendEquation {
  modeRGB?: number
  modeAlpha?: number
}
export interface UniformInfo extends WebGLActiveInfo {
  uniformName: string
  isStruct: boolean
  isStructArray: boolean
  structIndex: number
  structProperty: string
}
export class Program {
  gl: OGLRenderingContext
  uniforms: {
    [name: string]: {
      value: any
    }
  }
  id: number
  transparent: boolean
  cullFace: GLenum | false
  frontFace: GLenum
  depthTest: boolean
  depthWrite: boolean
  depthFunc: GLenum
  blendFunc: BlendFunc
  blendEquation: BlendEquation
  program: WebGLProgram
  uniformLocations: Map<any, WebGLUniformLocation>
  attributeLocations: Map<WebGLActiveInfo, GLint>
  attributeOrder: string
  gltfMaterial?: any
  constructor(gl: OGLRenderingContext, options?: Partial<ProgramOptions>)
  setBlendFunc(src: number, dst: number, srcAlpha?: number, dstAlpha?: number): void
  setBlendEquation(modeRGB: GLenum, modeAlpha: GLenum): void
  applyState(): void
  use(options?: { flipFaces?: boolean }): void
  remove(): void
}

export interface RendererOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  dpr: number
  alpha: boolean
  depth: boolean
  stencil: boolean
  antialias: boolean
  premultipliedAlpha: boolean
  preserveDrawingBuffer: boolean
  powerPreference: string
  autoClear: boolean
  webgl: number
}
export type OGLRenderingContext = {
  renderer: Renderer
  canvas: HTMLCanvasElement
} & (WebGL2RenderingContext | WebGLRenderingContext)
export type DeviceParameters = {
  maxTextureUnits?: number
  maxAnisotropy?: number
}
export type RenderState = {
  blendFunc?: {
    src: GLenum
    dst: GLenum
    srcAlpha?: GLenum
    dstAlpha?: GLenum
  }
  blendEquation?: {
    modeRGB: GLenum
    modeAlpha?: GLenum
  }
  cullFace?: number
  frontFace?: number
  depthMask?: boolean
  depthFunc?: number
  premultiplyAlpha?: boolean
  flipY?: boolean
  unpackAlignment?: number
  viewport?: {
    x: number
    y: number
    width: number | null
    height: number | null
  }
  textureUnits?: number[]
  activeTextureUnit?: number
  framebuffer?: WebGLFramebuffer
  boundBuffer?: WebGLBuffer
  uniformLocations?: Map<number, WebGLUniformLocation>
  currentProgram: number | null
}

export type RenderExtensions = {
  [key: string]: any
}

export interface RendererSortable extends Mesh {
  zDepth: number
}

export class Renderer {
  dpr: number
  alpha: boolean
  color: boolean
  depth: boolean
  stencil: boolean
  premultipliedAlpha: boolean
  autoClear: boolean
  gl: OGLRenderingContext
  isWebgl2: boolean
  width: number
  height: number
  parameters: DeviceParameters
  state: RenderState
  extensions: RenderExtensions
  vertexAttribDivisor: Function
  drawArraysInstanced: Function
  drawElementsInstanced: Function
  createVertexArray: Function
  bindVertexArray: Function
  deleteVertexArray: Function
  drawBuffers: Function
  currentProgram: number
  currentGeometry: string | null
  get id(): number
  private _id
  constructor(options?: Partial<RendererOptions>)
  setSize(width: number, height: number): void
  setViewport(width: number, height: number, x?: number, y?: number): void
  setScissor(width: number, height: number, x?: number, y?: number): void
  enable(id: GLenum): void
  disable(id: GLenum): void
  setBlendFunc(src: GLenum, dst: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void
  setBlendEquation(modeRGB: GLenum, modeAlpha: GLenum): void
  setCullFace(value: GLenum): void
  setFrontFace(value: GLenum): void
  setDepthMask(value: GLboolean): void
  setDepthFunc(value: GLenum): void
  activeTexture(value: number): void
  bindFramebuffer(options?: { target?: number; buffer?: WebGLFramebuffer }): void
  getExtension(extension: string, webgl2Func?: keyof WebGL2RenderingContext, extFunc?: string): any
  sortOpaque(a: RendererSortable, b: RendererSortable): number
  sortTransparent(a: RendererSortable, b: RendererSortable): number
  sortUI(a: RendererSortable, b: RendererSortable): number
  getRenderList({
    scene,
    camera,
    frustumCull,
    sort,
  }: {
    scene: Transform
    camera: Camera
    frustumCull: boolean
    sort: boolean
  }): Mesh[]
  render({
    scene,
    camera,
    target,
    update,
    sort,
    frustumCull,
    clear,
  }: Partial<{
    scene: Transform
    camera: Camera
    target: RenderTarget
    update: boolean
    sort: boolean
    frustumCull: boolean
    clear: boolean
  }>): void
}

export interface RenderTargetOptions {
  width: number
  height: number
  target: GLenum
  color: number
  depth: boolean
  stencil: boolean
  depthTexture: boolean
  wrapS: GLenum
  wrapT: GLenum
  minFilter: GLenum
  magFilter: GLenum
  type: GLenum
  format: GLenum
  internalFormat: GLenum
  unpackAlignment: number
  premultiplyAlpha: boolean
}
export class RenderTarget {
  gl: OGLRenderingContext
  width: number
  height: number
  depth: boolean
  buffer: WebGLFramebuffer
  target: number
  textures: Texture[]
  texture: Texture
  depthTexture: Texture
  depthBuffer: WebGLRenderbuffer
  stencilBuffer: WebGLRenderbuffer
  depthStencilBuffer: WebGLRenderbuffer
  constructor(gl: OGLRenderingContext, options?: Partial<RenderTargetOptions>)
  setSize(width: number, height: number): void
}

export type CompressedImage = {
  isCompressedTexture?: boolean
} & {
  data: Uint8Array
  width: number
  height: number
}[]
export type ImageRepresentation =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLImageElement[]
  | ArrayBufferView
  | CompressedImage
export interface TextureOptions {
  image: ImageRepresentation
  target: number
  type: number
  format: number
  internalFormat: number
  wrapS: number
  wrapT: number
  generateMipmaps: boolean
  minFilter: number
  magFilter: number
  premultiplyAlpha: boolean
  unpackAlignment: number
  flipY: boolean
  level: number
  width: number
  height: number
  anisotropy: number
}
export class Texture {
  ext: string
  gl: OGLRenderingContext
  id: number
  name: string
  image: ImageRepresentation
  target: number
  type: number
  format: number
  internalFormat: number
  wrapS: number
  wrapT: number
  generateMipmaps: boolean
  minFilter: number
  magFilter: number
  premultiplyAlpha: boolean
  unpackAlignment: number
  flipY: boolean
  level: number
  width: number
  height: number
  anisotropy: number
  texture: WebGLTexture
  store: {
    image: ImageRepresentation
  }
  glState: RenderState
  state: {
    minFilter: number
    magFilter: number
    wrapS: number
    wrapT: number
    anisotropy: number
  }
  needsUpdate: Boolean
  onUpdate?: () => void
  constructor(gl: OGLRenderingContext, options?: Partial<TextureOptions>)
  bind(): void
  update(textureUnit?: number): void
}

export class Transform {
  parent: Transform
  children: Transform[]
  visible: boolean
  matrix: Mat4
  worldMatrix: Mat4
  matrixAutoUpdate: boolean
  worldMatrixNeedsUpdate: boolean
  position: Vec3
  scale: Vec3
  up: Vec3
  quaternion: Quat
  rotation: Euler
  constructor()
  setParent(parent: Transform, notifyParent?: boolean): void
  addChild(child: Transform, notifyChild?: boolean): void
  removeChild(child: Transform, notifyChild?: boolean): void
  updateMatrixWorld(force?: boolean): void
  updateMatrix(): void
  traverse(callback: (node: Transform) => boolean | void): void
  decompose(): void
  lookAt(target: Vec3, invert?: boolean): void
}

// Math

export class Color extends Array<number> {
  constructor(color: [number, number, number])
  constructor(color: number, g: number, b: number)
  constructor(color: string)
  constructor(color: 'black' | 'white' | 'red' | 'green' | 'blue' | 'fuchsia' | 'cyan' | 'yellow' | 'orange')
  constructor(color?: number)
  get r(): number
  get g(): number
  get b(): number
  set r(v: number)
  set g(v: number)
  set b(v: number)
  set(color: [number, number, number]): this
  set(color: number, g: number, b: number): this
  set(color: string): this
  set(color: 'black' | 'white' | 'red' | 'green' | 'blue' | 'fuchsia' | 'cyan' | 'yellow' | 'orange'): this
  set(color: number): this
  copy(v: Color): this
}

export type EulerOrder = 'XYZ' | 'XZY' | 'YXZ' | 'YZX' | 'ZXY' | 'ZYX'
export class Euler extends Array<number> {
  onChange: () => void
  order: EulerOrder
  constructor(x?: number | Euler, y?: number, z?: number, order?: EulerOrder)
  get x(): number
  get y(): number
  get z(): number
  set x(v: number)
  set y(v: number)
  set z(v: number)
  set(x: number | Euler, y?: number, z?: number): this
  copy(v: Euler): this
  reorder(order: EulerOrder): this
  fromRotationMatrix(m: Mat4, order?: EulerOrder): this
  fromQuaternion(q: Quat, order?: EulerOrder): this
  toArray(a?: number[], o?: number): number[]
}

export class Mat3 extends Array<number> {
  constructor(
    m00?: number | Mat3,
    m01?: number,
    m02?: number,
    m10?: number,
    m11?: number,
    m12?: number,
    m20?: number,
    m21?: number,
    m22?: number,
  )
  set(
    m00: number | Mat3,
    m01?: number,
    m02?: number,
    m10?: number,
    m11?: number,
    m12?: number,
    m20?: number,
    m21?: number,
    m22?: number,
  ): this
  translate(v: Vec2, m?: Mat3): this
  rotate(v: number, m?: Mat3): this
  scale(v: Vec2, m?: Mat3): this
  multiply(ma: Mat3, mb: Mat3): this
  identity(): this
  copy(m: Mat3): this
  fromMatrix4(m: Mat4): this
  fromQuaternion(q: Quat): this
  fromBasis(vec3a: Vec3, vec3b: Vec3, vec3c: Vec3): this
  inverse(m?: Mat4): this
  getNormalMatrix(m: Mat4): this
}

export class Mat4 extends Array<number> {
  constructor(
    m00?: number | Mat4,
    m01?: number,
    m02?: number,
    m03?: number,
    m10?: number,
    m11?: number,
    m12?: number,
    m13?: number,
    m20?: number,
    m21?: number,
    m22?: number,
    m23?: number,
    m30?: number,
    m31?: number,
    m32?: number,
    m33?: number,
  )
  get x(): number
  get y(): number
  get z(): number
  get w(): number
  set x(v: number)
  set y(v: number)
  set z(v: number)
  set w(v: number)
  set(
    m00: number | Mat4,
    m01?: number,
    m02?: number,
    m03?: number,
    m10?: number,
    m11?: number,
    m12?: number,
    m13?: number,
    m20?: number,
    m21?: number,
    m22?: number,
    m23?: number,
    m30?: number,
    m31?: number,
    m32?: number,
    m33?: number,
  ): this
  translate(v: Vec3, m?: Mat4): this
  rotate(v: Vec3, axis: Vec3, m?: Mat4): this
  scale(v: Vec3, m?: Mat4): this
  multiply(ma: Mat4, mb: Mat4): this
  identity(): this
  copy(m: Mat4): this
  fromPerspective(
    options?: Partial<{
      fov: number
      aspect: number
      near: number
      far: number
    }>,
  ): this
  fromOrthogonal({
    left,
    right,
    bottom,
    top,
    near,
    far,
  }: Partial<{
    left: number
    right: number
    bottom: number
    top: number
    near: number
    far: number
  }>): this
  fromQuaternion(q: Quat): this
  setPosition(v: Vec3): this
  inverse(m?: Mat4): this
  compose(q: Quat, pos: Vec3, scale: Vec3): this
  getRotation(q: Quat): this
  getTranslation(pos: Vec3): this
  getScaling(scale: Vec3): this
  getMaxScaleOnAxis(): number
  lookAt(eye: Vec3, target: Vec3, up: Vec3): this
  determinant(): number
  fromArray(a: number[], o?: number): this
  toArray(a?: number[], o?: number): number[]
}

export class Quat extends Array<number> {
  onChange: () => void
  constructor(x?: number | Quat, y?: number, z?: number, w?: number)
  get x(): number
  get y(): number
  get z(): number
  get w(): number
  set x(v: number)
  set y(v: number)
  set z(v: number)
  set w(v: number)
  identity(): this
  set(x: number | Quat, y?: number, z?: number, w?: number): this
  rotateX(a: number): this
  rotateY(a: number): this
  rotateZ(a: number): this
  inverse(q?: Quat): this
  conjugate(q?: Quat): this
  copy(q: Quat): this
  normalize(q?: Quat): this
  multiply(qA: Quat, qB: Quat): this
  dot(v: Quat): number
  fromMatrix3(matrix3: Mat3): this
  fromEuler(euler: Euler): this
  fromAxisAngle(axis: Vec3, a: number): this
  slerp(q: Quat, t: number): this
  fromArray(a: number[], o?: number): this
  toArray(a?: number[], o?: number): number[]
}

export class Vec2 extends Array<number> {
  constructor(x?: number | Vec2, y?: number)
  get x(): number
  get y(): number
  set x(v: number)
  set y(v: number)
  set(x: number | Vec2, y?: number): this
  copy(v: Vec2): this
  add(va: Vec2, vb: Vec2): this
  sub(va: Vec2, vb: Vec2): this
  multiply(v: Vec2 | number): this
  divide(v: Vec2 | number): this
  inverse(v?: Vec2): this
  len(): number
  distance(v: Vec2): number
  squaredLen(): number
  squaredDistance(v?: Vec2): number
  negate(v?: Vec2): this
  cross(va: Vec2, vb: Vec2): number
  scale(v: number): this
  normalize(): this
  dot(v: Vec2): number
  equals(v: Vec2): boolean
  applyMatrix3(mat3: Mat3): this
  applyMatrix4(mat4: Mat4): this
  lerp(v: Vec2, a: number): this
  clone(): Vec2
  fromArray(a: number[], o?: number): this
  toArray(a?: number[], o?: number): number[]
}

export class Vec3 extends Array<number> {
  constant: number
  constructor(x?: number | Vec3, y?: number, z?: number)
  get x(): number
  get y(): number
  get z(): number
  set x(v: number)
  set y(v: number)
  set z(v: number)
  set(x: number | Vec3, y?: number, z?: number): this
  copy(v: Vec3): this
  add(va: Vec3, vb?: Vec3): this
  sub(va: Vec3, vb?: Vec3): this
  multiply(v: Vec3 | number): this
  divide(v: Vec3 | number): this
  inverse(v?: Vec3): this
  len(): number
  distance(v?: Vec3): number
  squaredLen(): number
  squaredDistance(v?: Vec3): number
  negate(v?: Vec3): this
  cross(va: Vec3, vb?: Vec3): this
  scale(v: number): this
  normalize(): this
  dot(v: Vec3): number
  equals(v: Vec3): boolean
  applyMatrix3(mat3: Mat3): this
  applyMatrix4(mat4: Mat4): this
  scaleRotateMatrix4(mat4: Mat4): this
  applyQuaternion(q: Quat): this
  angle(v: Vec3): number
  lerp(v: Vec3, t: number): this
  clone(): Vec3
  fromArray(a: number[], o?: number): this
  toArray(a?: number[], o?: number): number[]
  transformDirection(mat4: Mat4): this
}

export class Vec4 extends Array<number> {
  constructor(x?: number | Vec4, y?: number, z?: number, w?: number)
  get x(): number
  get y(): number
  get z(): number
  get w(): number
  set x(v: number)
  set y(v: number)
  set z(v: number)
  set w(v: number)
  set(x: number | Vec4, y?: number, z?: number, w?: number): this
  copy(v: Vec4): this
  normalize(): this
  multiply(v: number): this
  dot(v: Vec4): this
  fromArray(a: number[], o?: number): this
  toArray(a?: number[], o?: number): number[]
}

// Extras

export interface AnimationFrame {
  position: Vec3
  quaternion: Quat
  scale: Vec3
}
export interface AnimationData {
  frames: AnimationFrame[]
}
export interface AnimationOptions {
  objects: BoneTransform[]
  data: AnimationData
}
export class Animation {
  objects: BoneTransform[]
  data: AnimationData
  elapsed: number
  weight: number
  duration: number
  constructor({ objects, data }: AnimationOptions)
  update(totalWeight: number, isSet: boolean): void
}

type BasisImage = (Uint8Array | Uint16Array) & {
  width: number
  height: number
  isCompressedTexture: true
  internalFormat: number
  isBasis: true
}
export class BasisManager {
  constructor(workerSrc: string | URL)
  getSupportedFormat(): 'astc' | 'bptc' | 's3tc' | 'etc1' | 'pvrtc' | 'none'
  initWorker(workerSrc: string | URL): void
  onMessage(msg: { data: { id: number; error: string; image: BasisImage } }): void
  parseTexture(buffer: ArrayBuffer): Promise<BasisImage>
}

export type BoxOptions = {
  width: number
  height: number
  depth: number
  widthSegments: number
  heightSegments: number
  depthSegments: number
  attributes: AttributeMap
}
export class Box extends Geometry {
  constructor(gl: OGLRenderingContext, options?: Partial<BoxOptions>)
}

export interface CurveOptions {
  points: Vec3[]
  divisions: number
  type: 'catmullrom' | 'cubicbezier'
}
export class Curve {
  static CATMULLROM: 'catmullrom'
  static CUBICBEZIER: 'cubicbezier'
  static QUADRATICBEZIER: 'quadraticbezier'
  type: 'catmullrom' | 'cubicbezier' | 'quadraticbezier'
  private points
  private divisions
  constructor(options?: Partial<CurveOptions>)
  _getQuadraticBezierPoints(divisions?: number): Vec3[]
  _getCubicBezierPoints(divisions?: number): Vec3[]
  _getCatmullRomPoints(divisions?: number, a?: number, b?: number): Vec3[]
  getPoints(divisions?: number, a?: number, b?: number): Vec3[]
}

export type CylinderOptions = {
  radiusTop: number
  radiusBottom: number
  height: number
  radialSegments: number
  heightSegments: number
  openEnded: boolean
  thetaStart: number
  thetaLength: number
  attributes: AttributeMap
}
export class Cylinder extends Geometry {
  constructor(gl: OGLRenderingContext, options?: Partial<CylinderOptions>)
}

export interface FlowmapOptions {
  size: number
  falloff: number
  alpha: number
  dissipation: number
  type: number
}
export class Flowmap {
  gl: OGLRenderingContext
  uniform: {
    value: any
  }
  mask: {
    read: RenderTarget
    write: RenderTarget
    swap: () => void
  }
  aspect: number
  mouse: Vec2
  velocity: Vec2
  mesh: Mesh
  constructor(gl: OGLRenderingContext, options?: Partial<FlowmapOptions>)
  update(): void
}

export interface GLTFAnimationData {
  node: any
  transform: any
  interpolation: any
  times: any
  values: any
}
export class GLTFAnimation {
  private data: GLTFAnimationData[]
  private elapsed: number
  private weight: number
  private loop: boolean
  private duration: number
  private startTime: number
  private endTime: number
  constructor(data: GLTFAnimationData[], weight?: number)
  update(totalWeight: number, isSet: boolean): void
  cubicSplineInterpolate(t: number, prevVal: any, prevTan: any, nextTan: any, nextVal: any): any
}

export class GLTFLoader {
  static load(
    gl: OGLRenderingContext,
    src: string,
  ): Promise<{
    json: any
    buffers: any[]
    bufferViews: any
    images: any
    textures: any
    materials: any
    meshes: any
    nodes: any
    animations: any
    scenes: any
    scene: any
  }>
  static setBasisManager(manager: BasisManager): void
  static parse(
    gl: any,
    desc: any,
    dir: any,
  ): Promise<{
    json: any
    buffers: any[]
    bufferViews: any
    images: any
    textures: any
    materials: any
    meshes: any
    nodes: any
    animations: any
    scenes: any
    scene: any
  }>
  static parseDesc(src: any): Promise<any>
  static unpackGLB(glb: any): any
  static resolveURI(uri: any, dir: any): string
  static loadBuffers(desc: any, dir: any): Promise<any[]>
  static parseBufferViews(gl: any, desc: any, buffers: any): any
  static parseImages(gl: any, desc: any, dir: any, bufferViews: any): Promise<any>
  static parseTextures(gl: any, desc: any, images: any): any
  static createTexture(
    gl: any,
    desc: any,
    images: any,
    opts: { sample: any; source: any; name: any; extensions: any; extras: any },
  ): any
  static parseMaterials(gl: any, desc: any, textures: any): any
  static parseSkins(gl: any, desc: any, bufferViews: any): any
  static parseMeshes(gl: any, desc: any, bufferViews: any, materials: any, skins: any): any
  static parsePrimitives(
    gl: any,
    primitives: any,
    desc: any,
    bufferViews: any,
    materials: any,
    numInstances: any,
    isLightmap: boolean,
  ): any
  static parseAccessor(
    index: any,
    desc: any,
    bufferViews: any,
  ): {
    data: any
    size: any
    type: any
    normalized: any
    buffer: any
    stride: any
    offset: any
    count: any
    min: any
    max: any
  }
  static parseNodes(gl: any, desc: any, meshes: any, skins: any, images: any): any
  static parseLights(gl: any, desc: any, nodes: any, scenes: any): any
  static populateSkins(skins: any, nodes: any): void
  static parseAnimations(gl: any, desc: any, nodes: any, bufferViews: any): any
  static parseScenes(desc: any, nodes: any): any
}

export interface GLTFSkinSkeleton {
  joints: { worldMatrix: Mat4; bindInverse: Mat4 }[]
}
export interface GLTFSkinOptions {
  skeleton: GLTFSkinSkeleton
  geometry: Geometry
  program: Program
  mode: GLenum
}
export class GLTFSkin extends Mesh {
  skeleton: GLTFSkinSkeleton
  animations: Animation[]
  boneMatrices: Float32Array
  boneTextureSize: number
  boneTexture: Texture
  constructor(gl: OGLRenderingContext, options?: Partial<GLTFSkinOptions>)
  createBoneTexture(): void
  updateUniforms(): void
  draw(options?: { camera?: Camera }): void
}

export interface GPGPUpass {
  mesh: Mesh
  program: Program
  uniforms: {
    [name: string]: any
  }
  enabled: boolean
  textureUniform: string
}
export class GPGPU {
  gl: OGLRenderingContext
  passes: GPGPUpass[]
  geometry: Triangle
  dataLength: number
  size: number
  coords: Float32Array
  uniform: {
    value: any
  }
  fbo: {
    read: RenderTarget
    write: RenderTarget
    swap: () => void
  }
  constructor(
    gl: OGLRenderingContext,
    {
      data,
      geometry,
      type,
    }: {
      data?: Float32Array
      geometry?: Triangle
      type?: Texture['type']
    },
  )
  addPass(options?: {
    vertex?: string
    fragment?: string
    uniforms?: {
      [name: string]: any
    }
    textureUniform?: string
    enabled?: boolean
  }): {
    mesh: Mesh
    program: Program
    uniforms: {
      [name: string]: any
    }
    enabled: boolean
    textureUniform: string
  }
  render(): void
}

export interface KTXTextureOptions {
  buffer: ArrayBuffer
  src: string
  wrapS: number
  wrapT: number
  anisotropy: number
  minFilter: number
  magFilter: number
}
export class KTXTexture extends Texture {
  constructor(gl: OGLRenderingContext, options?: Partial<KTXTextureOptions>)
  parseBuffer(buffer: ArrayBuffer): void
}

export class NormalProgram extends Program {
  constructor(gl: OGLRenderingContext)
}

export type OrbitOptions = {
  element: HTMLElement
  enabled: boolean
  target: Vec3
  ease: number
  inertia: number
  enableRotate: boolean
  rotateSpeed: number
  autoRotate: boolean
  autoRotateSpeed: number
  enableZoom: boolean
  zoomSpeed: number
  enablePan: boolean
  panSpeed: number
  minPolarAngle: number
  maxPolarAngle: number
  minAzimuthAngle: number
  maxAzimuthAngle: number
  minDistance: number
  maxDistance: number
}
export class Orbit {
  constructor(
    object: Transform & {
      fov: number
    },
    options?: Partial<OrbitOptions>,
  )
  update(): void
  forcePosition(): void
  remove(): void
  enabled: boolean
  minDistance: number
  maxDistance: number
  offset: number
  zoomStyle: 'dolly' | any
  mouseButtons: { ORBIT: number; ZOOM: number; PAN: number }
  target: Vec3
}

export type PlaneOptions = {
  width: number
  height: number
  widthSegments: number
  heightSegments: number
  attributes: AttributeMap
}
export class Plane extends Geometry {
  constructor(gl: OGLRenderingContext, options?: Partial<PlaneOptions>)
  static buildPlane(
    position: Float32Array,
    normal: Float32Array,
    uv: Float32Array,
    index: Uint32Array | Uint16Array,
    width: number,
    height: number,
    depth: number,
    wSegs: number,
    hSegs: number,
    u?: number,
    v?: number,
    w?: number,
    uDir?: number,
    vDir?: number,
    i?: number,
    ii?: number,
  ): void
}

export interface PolylineOptions {
  points: Vec3[]
  vertex: string
  fragment: string
  uniforms: {
    [key: string]: {
      value: any
    }
  }
  attributes: AttributeMap
}
export class Polyline {
  gl: OGLRenderingContext
  points: Vec3[]
  count: number
  position: Float32Array
  prev: Float32Array
  next: Float32Array
  geometry: Geometry
  resolution: {
    value: Vec2
  }
  dpr: {
    value: number
  }
  thickness: {
    value: number
  }
  color: {
    value: Color
  }
  miter: {
    value: number
  }
  program: Program
  mesh: Mesh
  constructor(gl: OGLRenderingContext, { points, vertex, fragment, uniforms, attributes }: Partial<PolylineOptions>)
  updateGeometry(): void
  resize(): void
}

export interface PostOptions {
  width: number
  height: number
  dpr: number
  wrapS: GLenum
  wrapT: GLenum
  minFilter: GLenum
  magFilter: GLenum
  geometry: Triangle
  targetOnly: boolean
}
export interface Pass {
  mesh: Mesh
  program: Program
  uniforms: {
    [name: string]: any
  }
  enabled: boolean
  textureUniform: string
  vertex?: string
  fragment?: string
}
export class Post {
  gl: OGLRenderingContext
  options: {
    wrapS: GLenum
    wrapT: GLenum
    minFilter: GLenum
    magFilter: GLenum
    width?: number
    height?: number
  }
  passes: Pass[]
  geometry: Triangle
  uniform: {
    value: any
  }
  targetOnly: boolean
  fbo: { read: RenderTarget; write: RenderTarget; swap: () => void }
  dpr: number
  width: number
  height: number
  constructor(gl: OGLRenderingContext, options?: Partial<PostOptions>)
  addPass(options?: Partial<Pass>): {
    mesh: Mesh
    program: Program
    uniforms: {
      [name: string]: any
    }
    enabled: boolean
    textureUniform: string
  }
  resize(
    options?: Partial<{
      width: number
      height: number
      dpr: number
    }>,
  ): void
  render({
    scene,
    camera,
    texture,
    target,
    update,
    sort,
    frustumCull,
  }: {
    scene?: Transform
    camera?: Camera
    texture?: Texture
    target?: RenderTarget
    update?: boolean
    sort?: boolean
    frustumCull?: boolean
  }): void
}

export class Raycast {
  gl: OGLRenderingContext
  origin: Vec3
  direction: Vec3
  constructor(gl: OGLRenderingContext)
  castMouse(camera: Camera, mouse?: number[]): void
  intersectBounds(
    meshes: Mesh | Mesh[],
    options?: {
      maxDistance?: number
      output?: Mesh[]
    },
  ): Mesh[]
  intersectMeshes(
    meshes: Mesh[],
    options?: {
      cullFace?: boolean
      maxDistance?: number
      includeUV?: boolean
      includeNormal?: boolean
      output?: Mesh[]
    },
  ): Mesh[]
  intersectSphere(sphere: Bounds, origin?: Vec3, direction?: Vec3): number
  intersectBox(box: Bounds, origin?: Vec3, direction?: Vec3): number
  intersectTriangle(
    a: Vec3,
    b: Vec3,
    c: Vec3,
    backfaceCulling?: boolean,
    origin?: Vec3,
    direction?: Vec3,
    normal?: Vec3,
  ): number
  getBarycoord(point: Vec3, a: Vec3, b: Vec3, c: Vec3, target?: Vec3): Vec3
}

export class Shadow {
  gl: OGLRenderingContext
  light: Camera
  target: RenderTarget
  depthProgram: Program
  castMeshes: Mesh[]
  constructor(
    gl: OGLRenderingContext,
    {
      light,
      width,
      height,
    }: {
      light?: Camera
      width?: number
      height?: number
    },
  )
  add({
    mesh,
    receive,
    cast,
    vertex,
    fragment,
    uniformProjection,
    uniformView,
    uniformTexture,
  }: {
    mesh: Mesh
    receive?: boolean
    cast?: boolean
    vertex?: string
    fragment?: string
    uniformProjection?: string
    uniformView?: string
    uniformTexture?: string
  }): void
  render({ scene }: { scene: Transform }): void
}

export interface SkinRig {
  bindPose: { position: Vec3; quaternion: Quat; scale: Vec3 }
  bones: { name: string; parent: Transform }[]
}
export interface SkinOptions {
  rig: SkinRig
  geometry: Geometry
  program: Program
  mode: GLenum
}
export interface BoneTransform extends Transform {
  name: string
  bindInverse: Mat4
}
export class Skin extends Mesh {
  animations: Animation[]
  boneTexture: Texture
  boneTextureSize: number
  boneMatrices: Float32Array
  root: Transform
  bones: BoneTransform[]
  constructor(gl: OGLRenderingContext, options?: Partial<SkinOptions>)
  createBones(rig: SkinRig): void
  createBoneTexture(): void
  addAnimation(data: Animation['data']): Animation
  update(): void
  draw(options?: { camera?: Camera }): void
}

export type SphereOptions = {
  radius: number
  widthSegments: number
  heightSegments: number
  phiStart: number
  phiLength: number
  thetaStart: number
  thetaLength: number
  attributes: AttributeMap
}
export class Sphere extends Geometry {
  constructor(gl: OGLRenderingContext, options?: Partial<SphereOptions>)
}

export interface TextFontChar {
  char: string
  xoffset: number
  yoffset: number
  width: number
  height: number
  x: number
  y: number
  xadvance: number
}
export interface TextFontKerning {
  first: number
  second: number
  amount: number
}
export interface TextFont {
  chars: TextFontChar[]
  kernings: TextFontKerning[]
  common: {
    lineHeight: number
    base: number
    scaleW: number
    scaleH: number
  }
}
export type TextAlign = 'left' | 'right' | 'center'
export class Text {
  constructor({
    font,
    text,
    width,
    align,
    size,
    letterSpacing,
    lineHeight,
    wordSpacing,
    wordBreak,
  }: {
    font: any
    text: string
    width?: number
    align?: TextAlign
    size?: number
    letterSpacing?: number
    lineHeight?: number
    wordSpacing?: number
    wordBreak?: boolean
  })
}

export interface TextureLoaderOptions {
  src:
    | Partial<{
        pvrtc: string
        s3tc: string
        etc: string
        etc1: string
        astc: string
        webp: string
        jpg: string
        png: string
      }>
    | string
  wrapS: number
  wrapT: number
  anisotropy: number
  format: number
  internalFormat: number
  generateMipmaps: boolean
  minFilter: number
  magFilter: number
  premultiplyAlpha: boolean
  unpackAlignment: number
  flipY: boolean
}
export class TextureLoader {
  static load<T extends Texture>(gl: OGLRenderingContext, options?: Partial<TextureLoaderOptions>): T
  static getSupportedExtensions(gl: OGLRenderingContext): string[]
  static loadKTX(src: string, texture: KTXTexture): Promise<void>
  static loadImage(gl: OGLRenderingContext, src: string, texture: Texture, flipY: boolean): Promise<HTMLImageElement>
  static clearCache(): void
}

export interface TorusOptions {
  radius: number
  tube: number
  radialSegments: number
  tubularSegments: number
  arc: number
  attributes: AttributeMap
}
export class Torus extends Geometry {
  constructor(gl: OGLRenderingContext, options?: Partial<TorusOptions>)
}

export interface TriangleOptions {
  attributes: AttributeMap
}
export class Triangle extends Geometry {
  constructor(gl: OGLRenderingContext, options?: Partial<TriangleOptions>)
}

export interface AxesHelperOptions extends Omit<MeshOptions, 'mode'> {
  size: number
  symmetric: boolean
  xColor: Color
  yColor: Color
  zColor: Color
}
export class AxesHelper extends Mesh {
  constructor(gl: OGLRenderingContext, options?: AxesHelperOptions)
}

export interface FaceNormalsHelperOptions extends Omit<MeshOptions, 'mode'> {
  size: number
  color: Color
}
export class FaceNormalsHelper extends Mesh {
  constructor(object: Mesh, options?: FaceNormalsHelperOptions)
}

export interface GridHelperOptions extends Omit<MeshOptions, 'mode'> {
  size: number
  divisions: number
  color: Color
}
export class GridHelper extends Mesh {
  constructor(gl: OGLRenderingContext, options?: GridHelperOptions)
}

export interface VertexNormalsHelperOptions extends Omit<MeshOptions, 'mode'> {
  size: number
  color: Color
}
export class VertexNormalsHelper extends Mesh {
  constructor(object: Mesh, options?: VertexNormalsHelperOptions)
}

export interface WireMeshOptions extends Omit<MeshOptions, 'mode' | 'program'> {
  wireColor: Color
}
export class WireMesh extends Mesh {
  constructor(gl: OGLRenderingContext, options?: WireMeshOptions)
}

export type PathTiltFunction = (angle: number, t: number, path: Path) => number

export interface PathFrenetFrames {
  tangents: Vec3[]
  normals: Vec3[]
  binormals: Vec3[]
}

export class Path {
  /**
   * Tilt function receive an angle, relative path length offset in range [0..1] and path object instance. Should return new tilt angle
   */
  tiltFunction?: PathTiltFunction

  // private methods
  addSegment(segment: any): this
  getSegments(): any[]

  moveTo(p: Vec3, tilt?: number): void
  bezierCurveTo(cp1: Vec3, cp2: Vec3, p: Vec3, tilt?: number): this
  quadraticCurveTo(cp: Vec3, p: Vec3, tilt?: number): this
  lineTo(p: Vec3, tilt?: number): this
  updateLength(): void
  getLength(): number
  /**
   * Finding a path segment at a given absolute length distance
   */
  findSegmentIndexAtLength(len: number): [segmentIndex: number, relativeSegmentDistance: number]
  getPointAtLength(len: number, out?: Vec3): Vec3
  getPointAt(t: number, out?: Vec3): Vec3
  getTangentAtLength(len: number, out?: Vec3): number
  getTangentAt(t: number, out?: Vec3): number
  getTiltAtLength(len: number): number
  getTiltAt(t: number): number
  /**
   * Get sequence of points using `getPointAt(t)`
   */
  getPoints(divisions: number): Vec3[]
  /**
   * Generates the Frenet Frames.
   * See http://www.cs.indiana.edu/pub/techreports/TR425.pdf
   */
  computeFrenetFrames(divisions?: number, closed?: boolean): PathFrenetFrames
}

export class InstancedMesh extends Mesh {
  readonly isInstancedMesh: true
  frustumCulled: boolean

  totalInstanceCount?: number
  instanceTransforms?: Transform[]
  frustumCullFunction?: ({ camera: Camera }) => void
  instanceRenderList?: Transform[]

  addFrustumCull(): void
  removeFrustumCull(): void
}

export as namespace OGL
