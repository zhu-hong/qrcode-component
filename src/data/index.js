export const nativeControls = [
  {
    text: '标题',
    svg: `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect fill="#000000" fill-rule="nonzero" opacity="0" x="0" y="0" width="16" height="16"></rect><rect fill="#646A73" x="2" y="1" width="1.5" height="14" rx="0.75"></rect><rect fill="#646A73" x="12.5" y="1" width="1.5" height="14" rx="0.75"></rect><rect fill="#646A73" x="2" y="7" width="12" height="1.5" rx="0.75"></rect</svg>`,
    ctx: {
      type: 'title',
      tag: 'g',
      dynamic: {
        size: 72,
        align: 'center',
      },
      children: [
        {
          tag: 'rect',
          static: {
            'stroke-dasharray': 4,
            stroke: '#B4B8C5',
            'stroke-width': 1,
            fill: 'transparent',
          },
          dynamic: {},
        },
        {
          tag: 'text',
          dynamic:{
            fill: '#000000',
            'font-weight': 'bold',
            'font-style': 'normal',
            'font-family': '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
          },
          static: {
            x: 0,
            y: 0,
          },
          children: [
            {
              tag: 'tspan',
              static: {
                'data-type': 'title',
                textContent: '标题显示区',
              },
              dynamic: {},
            }
          ],
        },
      ],
    },
  },
  {
    text: '副标题',
    svg: `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect fill="#000000" fill-rule="nonzero" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M15.2441406,14.6425781 C15.5019531,14.6425781 15.6943359,14.5761719 15.8212891,14.4433594 C15.9482422,14.3105469 16.0117188,14.1484375 16.0117188,13.9570312 C16.0117188,13.7421875 15.9316406,13.5722656 15.7714844,13.4472656 C15.6113281,13.3222656 15.3789062,13.2597656 15.0742188,13.2597656 L15.0742188,13.2597656 L12.015625,13.2597656 C12.1132812,13.1113281 12.2089844,12.984375 12.3027344,12.8789062 C12.5214844,12.6132812 12.9248047,12.2402344 13.5126953,11.7597656 C14.1005859,11.2792969 14.5195312,10.9267578 14.7695312,10.7021484 C15.0195312,10.4775391 15.2646484,10.1669922 15.5048828,9.77050781 C15.7451172,9.37402344 15.8652344,8.93359375 15.8652344,8.44921875 C15.8652344,8.140625 15.8076172,7.84277344 15.6923828,7.55566406 C15.5771484,7.26855469 15.4160156,7.015625 15.2089844,6.796875 C15.0019531,6.578125 14.7617188,6.40625 14.4882812,6.28125 C14.0664062,6.09375 13.5566406,6 12.9589844,6 C12.4628906,6 12.0302734,6.07324219 11.6611328,6.21972656 C11.2919922,6.36621094 10.9873047,6.55859375 10.7470703,6.796875 C10.5068359,7.03515625 10.3261719,7.30078125 10.2050781,7.59375 C10.0839844,7.88671875 10.0234375,8.16796875 10.0234375,8.4375 C10.0234375,8.66015625 10.0878906,8.8359375 10.2167969,8.96484375 C10.3457031,9.09375 10.5078125,9.15820312 10.703125,9.15820312 C10.9257812,9.15820312 11.0947266,9.08789062 11.2099609,8.94726562 C11.3251953,8.80664062 11.4287109,8.60546875 11.5205078,8.34375 C11.6123047,8.08203125 11.6777344,7.921875 11.7167969,7.86328125 C12.0097656,7.4140625 12.4121094,7.18945312 12.9238281,7.18945312 C13.1660156,7.18945312 13.3896484,7.24414062 13.5947266,7.35351562 C13.7998047,7.46289062 13.9619141,7.61621094 14.0810547,7.81347656 C14.2001953,8.01074219 14.2597656,8.234375 14.2597656,8.484375 C14.2597656,8.71484375 14.2041016,8.95019531 14.0927734,9.19042969 C13.9814453,9.43066406 13.8193359,9.66503906 13.6064453,9.89355469 C13.3935547,10.1220703 13.1269531,10.3496094 12.8066406,10.5761719 C12.6269531,10.6972656 12.328125,10.9501953 11.9101562,11.3349609 C11.4921875,11.7197266 11.0234375,12.1816406 10.5039062,12.7207031 C10.3789062,12.8535156 10.2636719,13.0361328 10.1582031,13.2685547 C10.0527344,13.5009766 10,13.6875 10,13.828125 C10,14.046875 10.0820312,14.2373047 10.2460938,14.3994141 C10.4101562,14.5615234 10.6386719,14.6425781 10.9316406,14.6425781 L10.9316406,14.6425781 L15.2441406,14.6425781 Z" id="2" fill="#646A73" fill-rule="nonzero"></path><rect fill="#646A73" x="0" y="1" width="1.5" height="14" rx="0.75"></rect><rect fill="#646A73" x="7.5" y="1" width="1.5" height="14" rx="0.75"></rect><rect fill="#646A73" x="0" y="7" width="9" height="1.5" rx="0.75"></rect</svg>`,
    ctx: {
      type: 'subTitle',
      tag: 'g',
      dynamic: {
        size: 48,
        align: 'center',
      },
      children: [
        {
          tag: 'rect',
          static: {
            'stroke-dasharray': 4,
            stroke: '#B4B8C5',
            'stroke-width': 1,
            fill: 'transparent',
          },
          dynamic: {},
        },
        {
          tag: 'text',
          dynamic:{
            fill: '#000000',
            'font-weight': 'normal',
            'font-style': 'normal',
            'font-family': '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
          },
          static: {
            x: 0,
            y: 0,
          },
          children: [
            {
              tag: 'tspan',
              static: {
                textContent: '副标题显示区',
                'data-type': 'subTitle',
              },
              dynamic: {},
            }
          ],
        },
      ],
    },
  },
  {
    text: '字段',
    svg: `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-132.000000, -83.000000)"><g transform="translate(132.000000, 83.000000)"><rect fill="#D8D8D8" opacity="0" x="0" y="0" width="16" height="16"></rect><g transform="translate(1.249810, 0.756046)" fill-rule="nonzero"><path fill="#646A73" d="M7.56414075,0.14675898 C7.91928937,0.301852918 8.21145486,0.569683064 8.39695449,0.906448296 L8.46979641,1.05486907 L13.6265976,12.9510784 C13.7914087,13.3312806 13.6167997,13.7731013 13.2365974,13.9379124 C12.8880786,14.0889893 12.4877833,13.9548589 12.2965411,13.6386022 L12.2497633,13.5479122 L10.682,9.932 L3.018,9.932 L1.43811065,13.5497743 C1.27227114,13.9295291 0.829979523,14.1029418 0.450224677,13.9371023 C0.102116068,13.7850827 -0.0726077699,13.4007666 0.0284276649,13.0452617 L0.0628967057,12.9492163 L5.25907347,1.05052425 C5.64603234,0.164429606 6.67804611,-0.240199886 7.56414075,0.14675898 Z M6.66908343,1.59372661 L6.63428742,1.65108225 L3.673,8.432 L10.032,8.432 L7.09296213,1.65170294 C7.06779769,1.59365117 7.0215662,1.54729439 6.96358275,1.52197293 C6.85809529,1.4759064 6.73813173,1.50837046 6.66908343,1.59372661 Z"></path></g></g></g></g></svg>`,
    ctx: {
      type: 'field',
      tag: 'g',
      dynamic: {
        size: 24,
        align: 'center',
      },
      children: [
        {
          tag: 'rect',
          static: {
            'stroke-dasharray': 4,
            stroke: '#B4B8C5',
            'stroke-width': 1,
            fill: 'transparent',
          },
          dynamic: {},
        },
        {
          tag: 'text',
          dynamic:{
            fill: '#000000',
            'font-weight': 'normal',
            'font-style': 'normal',
            'font-family': '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
          },
          static: {
            x: 0,
            y: 0,
          },
          children: [
            {
              tag: 'tspan',
              static: {
                textContent: '字段显示区',
                'data-type': 'field',
              },
              dynamic: {},
            }
          ],
        },
      ],
    },
  },
  {
    text: '二维码',
    svg: `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-178.000000, -123.000000)"><g transform="translate(178.000000, 123.000000)"><rect fill="#696F77" opacity="0" x="0" y="0" width="16" height="16"></rect><rect stroke="#696F77" stroke-width="1.5" x="0.75" y="0.75" width="6" height="6" rx="1"></rect><rect stroke="#696F77" stroke-width="1.5" x="9.25" y="0.75" width="6" height="6" rx="1"></rect><rect stroke="#696F77" stroke-width="1.5" x="0.75" y="9.25" width="6" height="6" rx="1"></rect><path d="M15.2543971,8.5 C15.6340929,8.5 15.9478881,8.78215388 15.9975505,9.14822944 L16.0043971,9.25 L16.0043971,11.8762022 C16.0043971,12.7943756 15.2972869,13.5473946 14.3979243,13.620401 L14.2543971,13.6262022 L13.1246632,13.6262022 C12.2064898,13.6262022 11.4534708,12.919092 11.3804644,12.0197295 L11.3746632,11.8762022 L11.3746632,10.25 C11.3746632,10.1316533 11.2924297,10.0325132 11.1819859,10.0066027 L11.1246632,10 L10.15,10 C10.0316533,10 9.93251318,10.0822334 9.90660268,10.1926773 L9.9,10.25 L9.9,15.25 C9.9,15.6642136 9.56421356,16 9.15,16 C8.77030423,16 8.45650904,15.7178461 8.40684662,15.3517706 L8.4,15.25 L8.4,10.25 C8.4,9.3318266 9.10711027,8.57880766 10.0064728,8.5058012 L10.15,8.5 L11.1246632,8.5 C12.0428366,8.5 12.7958555,9.20711027 12.868862,10.1064728 L12.8746632,10.25 L12.8746632,11.8762022 C12.8746632,11.994549 12.9568966,12.0936891 13.0673404,12.1195996 L13.1246632,12.1262022 L14.2543971,12.1262022 C14.3727439,12.1262022 14.471884,12.0439688 14.4977945,11.933525 L14.5043971,11.8762022 L14.5043971,9.25 C14.5043971,8.83578644 14.8401836,8.5 15.2543971,8.5 Z" fill="#696F77" fill-rule="nonzero"></path><rect fill="#696F77" x="11" y="14.5" width="5" height="1.5" rx="0.75"></rect><circle fill="#696F77" cx="3.8" cy="3.8" r="1"></circle><circle fill="#696F77" cx="12.2" cy="3.8" r="1"></circle><circle fill="#696F77" cx="3.8" cy="12.2" r="1"></circle></g></g></g></svg>`,
    ctx: {
      type: 'qr',
      tag: 'image',
      static: {
        x: 0,
        y: 0,
        'data-type': 'qr',
        'href': `data:image/svg+xml;utf8,%3Csvg width='100' height='100' shape-rendering='crispEdges' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21' class='qrcode'%3E%3Cpath fill='%23ffffff' d='M0,0 h21v21H0z'%3E%3C/path%3E%3Cpath fill='%23000000' d='M0 0h7v1H0zM9 0h4v1H9zM14,0 h7v1H14zM0 1h1v1H0zM6 1h1v1H6zM9 1h1v1H9zM11 1h1v1H11zM14 1h1v1H14zM20,1 h1v1H20zM0 2h1v1H0zM2 2h3v1H2zM6 2h1v1H6zM9 2h1v1H9zM14 2h1v1H14zM16 2h3v1H16zM20,2 h1v1H20zM0 3h1v1H0zM2 3h3v1H2zM6 3h1v1H6zM8 3h4v1H8zM14 3h1v1H14zM16 3h3v1H16zM20,3 h1v1H20zM0 4h1v1H0zM2 4h3v1H2zM6 4h1v1H6zM8 4h1v1H8zM10 4h3v1H10zM14 4h1v1H14zM16 4h3v1H16zM20,4 h1v1H20zM0 5h1v1H0zM6 5h1v1H6zM10 5h1v1H10zM12 5h1v1H12zM14 5h1v1H14zM20,5 h1v1H20zM0 6h7v1H0zM8 6h1v1H8zM10 6h1v1H10zM12 6h1v1H12zM14,6 h7v1H14zM9 7h4v1H9zM0 8h2v1H0zM5 8h3v1H5zM9 8h1v1H9zM12 8h1v1H12zM16 8h2v1H16zM0 9h2v1H0zM4 9h2v1H4zM8 9h2v1H8zM12 9h1v1H12zM14 9h1v1H14zM16 9h2v1H16zM19,9 h2v1H19zM0 10h2v1H0zM6 10h1v1H6zM8 10h1v1H8zM10 10h2v1H10zM13 10h1v1H13zM16 10h2v1H16zM20,10 h1v1H20zM2 11h1v1H2zM5 11h1v1H5zM7 11h4v1H7zM16 11h1v1H16zM2 12h1v1H2zM5 12h2v1H5zM8 12h3v1H8zM14 12h1v1H14zM17 12h1v1H17zM19,12 h2v1H19zM8 13h1v1H8zM10 13h6v1H10zM17,13 h4v1H17zM0 14h7v1H0zM8 14h2v1H8zM12 14h1v1H12zM14 14h2v1H14zM18,14 h3v1H18zM0 15h1v1H0zM6 15h1v1H6zM8 15h6v1H8zM15 15h2v1H15zM20,15 h1v1H20zM0 16h1v1H0zM2 16h3v1H2zM6 16h1v1H6zM12 16h1v1H12zM15 16h1v1H15zM19 16h1v1H19zM0 17h1v1H0zM2 17h3v1H2zM6 17h1v1H6zM9 17h2v1H9zM12 17h1v1H12zM18 17h1v1H18zM0 18h1v1H0zM2 18h3v1H2zM6 18h1v1H6zM14 18h1v1H14zM18,18 h3v1H18zM0 19h1v1H0zM6 19h1v1H6zM8 19h3v1H8zM16 19h1v1H16zM18 19h1v1H18zM0 20h7v1H0zM8 20h2v1H8zM11 20h1v1H11zM13 20h1v1H13zM16 20h1v1H16zM18 20h2v1H18z'%3E%3C/path%3E%3C/svg%3E`,
      },
      dynamic: {
        width: 150,
        height: 150,
      },
    },
  },
  {
    text: 'LOGO',
    svg: `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-224.000000, -83.000000)"><g transform="translate(224.000000, 83.000000)"><circle stroke="#646A73" stroke-width="1.5" cx="8" cy="8" r="7.25"></circle><path d="M8.08612051,3.61777158 L9.15368495,6.48020468 L12.5874396,6.78918952 L9.97341604,8.55222818 C10.1188954,9.19405416 10.2444298,9.76413037 10.3500026,10.2624604 C10.3906585,10.4383531 10.4256672,10.6031259 10.4574919,10.767899 L10.4574919,10.767899 L10.952442,11.3831731 L8.00411921,9.75514793 C7.41860707,10.0892812 6.89432604,10.3826635 6.43739681,10.6319479 C6.26978818,10.7219417 6.10385572,10.8119357 5.93959926,10.9019295 C5.77281496,10.9933084 5.62135371,11.0781709 5.48520334,11.1564955 C5.58550516,10.6129118 5.62989078,10.4458382 5.67848559,10.2657946 C5.77807838,9.87110405 5.8909503,9.42548572 6.01710116,8.92893956 C5.42512678,7.99325542 5.07180428,7.70243072 4.75819684,7.44652698 C4.62496395,7.33794475 4.49339646,7.23095933 4.36349439,7.12557069 L4.36349439,7.12557069 L6.79584002,6.50080367 L8.08612051,3.61777158 Z" stroke="#646A73" stroke-width="1.2" fill-rule="nonzero"></path></g></g></g></svg>`,
    ctx: {
      type: 'logo',
      tag: 'g',
      static: {
        x: 0,
        y: 0,
      },
      dynamic: {
        width: 60,
        height: 30,
      },
      children: [
        {
          tag: 'rect',
          static: {
            fill: '#DFE3E9',
          },
          dynamic: {},
        },
        {
          tag: 'text',
          static: {
            textContent: 'LOGO',
            fill: '#8F959E',
            'dominant-baseline': 'middle',
            'text-anchor': 'middle',
            'font-family': '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
          },
          dynamic: {},
        },
        {
          tag: 'image',
          static: {
            href: '',
            'data-type': 'logo',
          },
          dynamic: {},
        },
      ],
    },
  },
  {
    text: '矩形',
    svg: `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-270.000000, -83.000000)" stroke-width="1.5"><g transform="translate(270.000000, 83.000000)"><rect stroke="#646A73" x="0.75" y="1.75" width="14.5" height="12.5" rx="1"></rect></g></g></g></svg>`,
    ctx: {
      type: 'rect',
      tag: 'rect',
      static: {
        'data-type': 'rect',
        x: 0,
        y: 0,
      },
      dynamic: {
        width: 200,
        height: 200,
        fill: '#000000',
        rx: 0,
      },
    },
  },
  {
    text: '直线',
    svg: `<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-316.000000, -83.000000)"><g transform="translate(316.000000, 83.000000)"><rect fill="#646A73" transform="translate(7.750000, 8.000000) rotate(-315.000000) translate(-7.750000, -8.000000) " x="7" y="-8.34887715e-14" width="1.5" height="16" rx="0.75"></rect></g></g></g></svg>`,
    ctx: {
      type: 'line',
      tag: 'g',
      static: {
        x: 0,
        y: 0,
        'data-type': 'line',
      },
      children: [
        {
          tag: 'rect',
          static: {
            x: 0,
            y: 0,
            fill: 'transparent',
          },
          dynamic: {
            width: 200 + 20,
            height: 1 + 20,
          },
        },
        {
          tag: 'line',
          static: {
            x1: 0,
            y1: 0,
            y2: 0,
          },
          dynamic: {
            x2: 200,
            stroke: '#000000',
            'stroke-width': 4,
            'data-type': 'line',
            'stroke-dasharray': '0',
            transform: `translate(${10},${4 / 2 + 10})`,
          },
        },
      ],
    },
  },
]

export const fontFamilys = [
  {
    name: '黑体',
    value: '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
  },
  {
    name: '楷体',
    value: 'Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, DFKai-SB, "TW\-Kai", serif',
  },
  {
    name: '宋体',
    value: 'Georgia, "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", STSong, "AR PL New Sung", "AR PL SungtiL GB", NSimSun, SimSun, "TW\-Sung", "WenQuanYi Bitmap Song", "AR PL UMing CN", "AR PL UMing HK", "AR PL UMing TW", "AR PL UMing TW MBE", PMingLiU, MingLiU, serif',
  },
  {
    name: '仿宋',
    value: 'Baskerville, "Times New Roman", "Liberation Serif", STFangsong, FangSong, FangSong_GB2312, "CWTEX\-F", serif',
  },
]

export const nativeColors = ['#FFFFFF', '#000000', '#254569', '#2B2A6F', '#2D65B7', '#3B75A9', '#67717C', '#838276', '#2F674C', '#148B64', '#586531', '#66383A', '#B52B2B', '#E68448', '#DC8C00', '#F9BD00']
