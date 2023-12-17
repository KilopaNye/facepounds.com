
def count_up_to(max):
    count = 1
    while count <= max:
        yield count
        count += 1

# 使用生成器
# for number in count_up_to(5):
#     print(number)
number = count_up_to(5)
print(next(number))
print(next(number))
print(next(number))
print(next(number))
print(next(number))

def generator(max):
    count = 1
    while count<=max
        yield count
        count+=1