const userData = require('./data/userList.js') 
const client = require('cheerio-httpcli')
const log = console.log

Date.prototype.yyyymmdd = function(){
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();

    return yyyy +'-'+ (mm[1] ? mm + '-' : '0'+mm[0] + '-') + (dd[1] ? dd : '0'+dd[0]);
}
const today = (new Date()).yyyymmdd()
const commitSection = []
// yyyy-mm-dd 형태로 오늘을 저장
const chain = []
// 빈배열 생성
let userList = userData.userList
// ./data/userList.js에서 데이터를 import
for(const i in userList) {
    client.fetch("https://github.com/"+ userList[i].gitHubName, function(err, $, res) {
        if(err) {
            log(err)
            return
        }
        userList[i].commit = ($(`[data-date=${today}]`)[0]['attribs']['data-count'])
        
        for(const i in $('.day')) {
            if(i < $('.day').length -1) {
                chain[i] = Number($('.day')[i]['attribs']['data-count'])
            }
        }
        const count = chain.lastIndexOf(0)
        userList[i].chain = count
    })
}
log('크롤링 진행중 입니다.....(인터넷 속도가 느리면 실패할 수도 있습니다.)')
// log('node는 아직 공부중이라 동기/비동기 코드 작성이 어려워 setTimeout()로 10초뒤에 데이터 정렬합니다.')

global.setTimeout(()=> {
    const bad = userList.filter((user) => user.commit === '0')
    // 오늘 커밋 안한사람
    const good = userList.filter((user) => user.commit !== '0')
    // 오늘 커밋 한사람

    good.sort((a,b) => {
        if (a.chain > b.chain) {
            return 1
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    })
    // 오늘 커밋한 사람들 연속커밋 많은순으로 정렬

    log('-----------------------------------------------')
    log('오늘 잔디 심은 사람')
    log('')
    for(const i in good) {
        log(`${good[i].nickName}`)
        log(`          (연속으로 잔디 심은 날 :${chain.length - good[i].chain}일)`)
    }
    log('-----------------------------------------------')

    log('')
    log('-----------------------------------------------')
    log(`오늘 잔디 안심은 사람`)
    log('')
    for(const i in bad) {
        log(`${bad[i].nickName}`)
    }
    log('-----------------------------------------------')
}, 10000)



