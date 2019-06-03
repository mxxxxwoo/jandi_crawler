const client = require('cheerio-httpcli')
const log = console.log

Date.prototype.yyyymmdd = function(){
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();

    return yyyy +'-'+ (mm[1] ? mm + '-' : '0'+mm[0] + '-') + (dd[1] ? dd : '0'+dd[0]);
}
const today = (new Date()).yyyymmdd()

let userList = [
    {nickName: '뇸뇸',            gitHubName:	'ellapresso',       commit: '', chain: 0 },
    {nickName: '말랑',            gitHubName:	'ljhg1124',         commit: '', chain: 0 },
    {nickName: 'ㄷㄷ',            gitHubName:	'x86kernel',        commit: '', chain: 0 },
    {nickName: '또르',            gitHubName:	'9992',             commit: '', chain: 0 },
    {nickName: '싸이클러',        gitHubName:	'msnodeve',         commit: '' , chain: 0},
    {nickName: '컴공돌이',        gitHubName:	'cafemug',          commit: '' , chain: 0},
    {nickName: '1컴',             gitHubName:	'horace-velmont',  commit: '', chain: 0 },
    {nickName: '깃허브초보',      gitHubName:	'Tonoff',           commit: '' , chain: 0},
    {nickName: '레게힙합소년',    gitHubName:	'samkookji77',       commit: '' , chain: 0},
    {nickName: '방탕성현단',      gitHubName:	'Seonghy',          commit: '' , chain: 0},
    {nickName: '복이',            gitHubName:	'changbokLee',      commit: '' , chain: 0},
    {nickName: '제영',            gitHubName:	'Ign0reLee',        commit: '' , chain: 0},
    {nickName: '해피스마일',      gitHubName:	'rnhappysmile',      commit: '' , chain: 0},
    {nickName: 'ccpo',           gitHubName:	'ccppoo',           commit: '' , chain: 0},
    {nickName: 'gitory',         gitHubName:	'haeyoonjo',        commit: '' , chain: 0},
    {nickName: '퐁퐁',           gitHubName:	'SeongMinSeok',     commit: '' , chain: 0},
    {nickName: '깃☆',           gitHubName:	    'WG19',             commit: '' , chain: 0},
    {nickName: '하준',           gitHubName:	'Chanmi-Kim',       commit: '' , chain: 0},
    {nickName: '맹코',           gitHubName:	'Mengkko',          commit: '' , chain: 0}
]

const param = {}
const cc = []

for(const i in userList) {
    client.fetch("https://github.com/"+ userList[i].gitHubName, param, function(err, $, res) {
        if(err) {
            log(err)
            return
        }
        userList[i].commit = ($(`[data-date=${today}]`)[0]['attribs']['data-count'])
        
        for(const i in $('.day')) {
            if(i <366) {
                cc[i] = Number($('.day')[i]['attribs']['data-count'])
            }
        }
        const count = cc.lastIndexOf(0)
        userList[i].chain = count
    })
}
log('크롤링 진행중 입니다.....(인터넷 속도가 느리면 실패할 수도 있습니다.)')
log('node는 아직 공부중이라 동기/비동기 코드 작성이 어려워 setTimeout()로 5초뒤에 데이터 정렬합니다.')

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
        log(`          (연속으로 잔디 심은 날 :${365 - good[i].chain}일)`)
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
}, 5000)



