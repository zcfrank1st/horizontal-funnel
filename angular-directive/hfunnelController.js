/**
 * Created by zcfrank1st on 10/24/14.
 */
angular
    .module('demo',[])
    .controller('demo', function ($scope) {

        var funnelName = '结婚产品线漏斗';
        var nodesShowObjs = [];
        nodesShowObjs.push({
            id: "1",
            name: "主站首页",
            pv: "1279978",
            transferRate: "100%",
            url: "",
            uv: "717277",
            visits: "849326"
        });
        nodesShowObjs.push({
            id: "2",
            name: "所有商列表页",
            pv: "403628",
            transferRate: "33.36%",
            url: "",
            uv: "239271",
            visits: "270597"
        });
        nodesShowObjs.push({
            id: "3",
            name: "结婚商户页",
            pv: "6007",
            transferRate: "1.66%",
            url: "",
            uv: "3961",
            visits: "4319"
        });
        nodesShowObjs.push({
            id: "4",
            name: "结婚产品页",
            pv: "1168",
            transferRate: "12.29%",
            url: "",
            uv: "487",
            visits: "496"
        });


        $scope.funnel = {
            name: funnelName,
            headers: [
                {
                    label: "总转化率: ",
                    value: (nodesShowObjs[nodesShowObjs.length - 1].uv / nodesShowObjs[0].uv * 100).toFixed(2) + '%'
                }
            ],
            ratekey: "uv",
            nodes: nodesShowObjs
        };
    });
