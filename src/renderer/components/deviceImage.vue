<template>
    <div class="device">
        <div
                :class="small?'deviceBoxSmall':middle?'deviceBoxMiddle':large?'deviceBoxLarge':'deviceBoxMini'"
        >
            <span class="circle"></span>
            <div class="menu">
                <ul style="list-style-type: none">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div class="media"></div>
            <div class="line"></div>
        </div>
    </div>
</template>

<script>
export default {
  props: { mini: Boolean, small: Boolean, middle: Boolean, large: Boolean }
}
</script>

<style lang="less" scoped>
    .device {
        > div {

            position: relative;
            border-radius: 10px;
            border: 1px solid #666;
        }
    }

    .deviceBoxMiddle {
        width: 100px;
        height: 150px;
    }

    .deviceBoxSmall {
        width: 80px;
        height: 100px;
    }

    .deviceBoxMini {
        width: 30px;
        height: 50px;
    }

    .circle {
        position: absolute;
        left: 5px;
        top: 5px;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background: #dddddd;
        display: inline-block;
    }

    .menu {
        width: 30px;
        position: absolute;
        left: -30px;
        bottom: 10px;

        li {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            font-size: 12px;
            margin: 5px;
            box-sizing: border-box;
            background: #666666;
        }
    }

    .media {
        width: 40px;
        height: 60px;
        border: 2px solid #666666;
        position: absolute;
        bottom: 20px;
        right: 10px;
    }

    .deviceBoxSmall {
        li {
            width: 8px;
            height: 8px;
        }

        .media {
            width: 20px;
            height: 30px;
        }
    }

    .device .deviceBoxMini {
        .circle {
            width: 3px;
            height: 3px;
        }

        border-radius: 2px;

        li {
            width: 3px;
            height: 3px;
            margin: 2px;
        }

        .menu {
            left: -35px;
            bottom: -10px;
        }

        .media {
            right: 2px;
            bottom: 2px;
            width: 5px;
            height: 15px;
        }
    }

    .deviceBoxLarge {
        width: 100px;
        height: 250px;
        transform: rotate(270deg);
    }

    .device .deviceBoxLarge {
        .menu {
            left: -30px;
            bottom: 10px;
        }

        .media {
            right: 10px;
            bottom: 10px;
            width: 40px;
            height: 90px;
        }
    }

    .deviceBoxMiddle {
        top: -60px;
    }

    .deviceBoxLarge .line,
    .deviceBoxMiddle .line {
        position: absolute;
        border: 1px solid #666;
        width: 8px;
        height: 100px;
    }

    .deviceBoxMiddle .line {
        top: 150px;
        height: 60px;
        width: 5px;
        left: 20px;
        border-bottom: none;
    }

    .deviceBoxLarge .line {
        border-bottom: none;
        top: 250px;
        left: 15px;
    }

    .line::before {
        background: #dcdcdc;
        display: inline-block;

        position: absolute;
        border: 1px solid #666;
    }

    .deviceBoxLarge .line::before {
        width: 20px;
        height: 40px;
        content: "";
        left: -6px;

        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .deviceBoxMiddle .line::before {
        width: 15px;
        height: 30px;
        content: "";
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        left: -5px;
    }
</style>
