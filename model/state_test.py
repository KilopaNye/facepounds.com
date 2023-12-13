
def state_check(head,number):
    try:
        check_numbers = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
        id_map = {
            "A": 10,
            "B": 11,
            "C": 12,
            "D": 13,
            "E": 14,
            "F": 15,
            "G": 16,
            "H": 17,
            "I": 34,
            "J": 18,
            "K": 19,
            "M": 21,
            "N": 22,
            "O": 35,
            "P": 23,
            "Q": 24,
            "T": 27,
            "U": 28,
            "V": 29,
            "W": 32,
            "X": 30,
            "Z": 33,
            "L": 20,
            "R": 25,
            "S": 26,
            "Y": 31,
        }
        print(str(id_map[head])+number)
        original_number = str(id_map[head])+number
        # 將每個數字分別乘以對應的權重，然後相加
        result = sum(int(digit) * weight for digit, weight in zip(str(original_number), check_numbers))
        print(result)
        result = result % 10==0
        
        if result:
            print("驗證成功")
            return True
        else:
            print("驗證失敗")
            return False
    except Exception as err:
        print(err)


def test_state_check():
    assert state_check("A","123456789") == True
    assert state_check("Z","250052101") == True
    assert state_check("B","123456789") == False
    assert state_check("C","123456789") == False
    assert state_check("D","123456789") == False
    assert state_check("E","123456789") == False
    assert state_check("F","123456789") == False
    assert state_check("V","385152000") == False