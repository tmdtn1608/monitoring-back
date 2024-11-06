const PROCESS_TYPE: string[] = ["black","white"];
export const CheckProcessType = (param : string) :boolean => {
    
    return PROCESS_TYPE.includes(param);
}

/**
 * StringBuilder
 */
export class StringBuilder {
    private readonly _strings: string[] = [];

    // 문자열 추가
    append(value: string): StringBuilder {
        this._strings.push(value);
        return this; // 체이닝을 위해 this를 반환
    }

    // 줄 바꿈 추가
    appendLine(value: string = ""): StringBuilder {
        this._strings.push(value + "\n");
        return this; // 체이닝을 위해 this를 반환
    }

    // 특정 위치에 문자열 삽입
    insert(index: number, value: string): StringBuilder {
        if (index < 0 || index > this.length()) {
            throw new RangeError("Index out of bounds");
        }
        const before = this.toString().slice(0, index);
        const after = this.toString().slice(index);
        this.clear();
        this._strings.push(before, value, after);
        return this;
    }

    // 문자열 길이 반환
    length(): number {
        return this.toString().length;
    }

    // 현재 모든 문자열을 하나로 병합하여 반환
    toString(): string {
        return this._strings.join('');
    }

    // 내부 문자열을 모두 지우기
    clear(): StringBuilder {
        this._strings.length = 0;
        return this;
    }
}
