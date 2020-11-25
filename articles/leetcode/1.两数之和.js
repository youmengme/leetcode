function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i])) {
      return [map.get(target - nums[i]), i]
    }
    map.set(nums[i], i)
    console.log(map)
  }
}

const nums = [2, 7, 11, 15]
const target = 9

console.log(twoSum(nums, target))
