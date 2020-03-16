// listSize(属性) pos(属性) length(属性) clear(方法) toString(方法) getElement(方法) insert(方法) append(方法) remove(方法) front(方法) end(方法) prev(方法) next(方法) currPos(方法) moveTo(方法)
// 列表的元素个数
// 列表的当前位置
// 返回列表中元素的个数
// 清空列表中的所有元素
// 返回列表的字符串形式
// 返回当前位置的元素
// 在现有元素后插入新元素
// 在列表的末尾添加新元素
// 从列表中删除元素
// 将列表的当前位置设移动到第一个元素
// 将列表的当前位置移动到最后一个元素
// 将当前位置后移一位
// 将当前位置前移一位
// 返回列表的当前位置
// 将当前位置移动到指定位置

function List(data = []) {
  this.listSize = data.length
  this.pos = 0
  this.dataStore = data // 初始化一个空数组来保存列表元素
}
List.prototype.length = length
List.prototype.clear = clear
List.prototype.toString = toString
List.prototype.getElement = getElement
List.prototype.insert = insert
List.prototype.append = append
List.prototype.remove = remove
List.prototype.front = front
List.prototype.end = end
List.prototype.prev = prev
List.prototype.next = next
List.prototype.currPos = currPos
List.prototype.moveTo = moveTo
List.prototype.contains = contains
List.prototype.getMaxEle = getMaxEle
List.prototype.getMinEle = getMinEle
List.prototype.insertMax = insertMax
List.prototype.insertMin = insertMin

function length() {
  return this.listSize
}
function clear() {
  this.dataStore = []
  this.listSize = 0
  this.pos = 0
}
function toString() {
  return this.dataStore
}
function getElement(pos) {
  return this.dataStore[pos || this.pos]
}
function insert(ele, index = 0) {
  if (index < this.length()) {
    this.dataStore.splice(index, 0, ele)
  } else {
    this.append(ele)
  }
}
function append(ele) {
  this.dataStore.push(ele)
}
function remove(ele) {
  var index = this.dataStore.indexOf(ele)
  if (index >= 0) {
    this.dataStore.splice(index, 1)
    return true
  }
  return false
}

function front() {
  this.pos = 0
}
function end() {
  this.pos = this.listSize - 1
}
function prev() {
  this.pos > 0 ? this.pos-- : null
}
function next() {
  this.pos < this.listSize - 1 ? this.pos++ : null
}

function currPos() {
  return this.pos
}
function moveTo(index) {
  if (index < 0) {
    index = 0
  }
  if (index >= this.listSize) {
    index = this.listSize - 1
  }
  this.pos = index
}

function contains(ele) {
  if (this.dataStore.indexOf(ele) > -1) {
    return true
  }
  return false
}

function getMaxEle() {
  var max =
    Math.max.apply(null, this.dataStore) ||
    this.dataStore.concat([]).sort()[this.listSize - 1]
  return max
}

function getMinEle() {
  var min =
    Math.min.apply(null, this.dataStore) || this.dataStore.concat([]).sort()[0]
  return min
}
function insertMax(ele) {
  if (ele > this.getMaxEle()) {
    this.insert(ele)
  } else {
    console.log('不满足插入条件')
  }
}
function insertMin(ele) {
  if (ele < this.getMinEle()) {
    this.insert(ele)
  } else {
    console.log('不满足插入条件')
  }
}
