update cities
set polygon = ST_GeomFromText('POLYGON((3.1172447 46.9870531, 3.1174244 46.9862804, 3.1179077 46.9853244, 3.1179487 46.9851931, 3.1182133 46.9843461, 3.1184757 46.9837590, 3.1186500 46.9835715, 3.1191481 46.9830359, 3.1193821 46.9826451, 3.1194605 46.9818788, 3.1196130 46.9815760, 3.1198931 46.9811829, 3.1202445 46.9811745, 3.1208826 46.9803873, 3.1210102 46.9784594, 3.1237229 46.9758692, 3.1236187 46.9753667, 3.1235940 46.9752478, 3.1235057 46.9748220, 3.1234116 46.9746008, 3.1233227 46.9743915, 3.1232961 46.9743290, 3.1221596 46.9734974, 3.1212599 46.9727351, 3.1212482 46.9726588, 3.1212977 46.9725698, 3.1213983 46.9723889, 3.1216290 46.9721669, 3.1216653 46.9721319, 3.1209868 46.9716211, 3.1209675 46.9714793, 3.1217498 46.9709927, 3.1217736 46.9709779, 3.1215361 46.9706631, 3.1205944 46.9698843, 3.1216161 46.9689839, 3.1206724 46.9682499, 3.1205665 46.9681123, 3.1205370 46.9679586, 3.1208225 46.9679012, 3.1217585 46.9679942, 3.1219219 46.9679501, 3.1220688 46.9678459, 3.1218559 46.9676603, 3.1218550 46.9674091, 3.1226598 46.9665871, 3.1230666 46.9661717, 3.1235960 46.9656310, 3.1257490 46.9632968, 3.1284865 46.9650556, 3.1308983 46.9658979, 3.1317640 46.9662579, 3.1321590 46.9664739, 3.1345922 46.9684024, 3.1357071 46.9690307, 3.1367891 46.9698041, 3.1395618 46.9731075, 3.1403694 46.9740696, 3.1417801 46.9754718, 3.1439558 46.9771910, 3.1473965 46.9769182, 3.1524945 46.9766797, 3.1547232 46.9766874, 3.1558463 46.9767601, 3.1561719 46.9767251, 3.1561740 46.9763971, 3.1566077 46.9763522, 3.1566765 46.9764890, 3.1567384 46.9765046, 3.1567605 46.9766280, 3.1572129 46.9766328, 3.1572634 46.9769329, 3.1582407 46.9771078, 3.1583240 46.9775637, 3.1589328 46.9777290, 3.1590748 46.9777215, 3.1592970 46.9776691, 3.1595056 46.9782812, 3.1598799 46.9780357, 3.1600861 46.9781107, 3.1613840 46.9775690, 3.1617461 46.9773402, 3.1618439 46.9773350, 3.1619294 46.9772885, 3.1620534 46.9772210, 3.1651521 46.9770866, 3.1648798 46.9768268, 3.1652558 46.9766598, 3.1659668 46.9773662, 3.1655536 46.9775255, 3.1665314 46.9778460, 3.1669771 46.9770402, 3.1672375 46.9767737, 3.1674990 46.9766050, 3.1692963 46.9757790, 3.1704510 46.9753524, 3.1750383 46.9785629, 3.1753824 46.9786351, 3.1732507 46.9819564, 3.1750596 46.9819644, 3.1767440 46.9821006, 3.1781387 46.9823253, 3.1788082 46.9825389, 3.1783018 46.9830689, 3.1779628 46.9838623, 3.1777546 46.9847187, 3.1775272 46.9853049, 3.1780196 46.9854411, 3.1784842 46.9855281, 3.1775422 46.9869157, 3.1777267 46.9893606, 3.1777718 46.9895167, 3.1786001 46.9900482, 3.1793082 46.9916180, 3.1803231 46.9919808, 3.1805420 46.9925731, 3.1780529 46.9957690, 3.1761592 46.9993920, 3.1757771 46.9998540, 3.1762709 47.0002762, 3.1761730 47.0003756, 3.1761302 47.0004220, 3.1761453 47.0006047, 3.1760426 47.0007940, 3.1761416 47.0009006, 3.1760960 47.0009731, 3.1754021 47.0013798, 3.1749697 47.0014661, 3.1749961 47.0016261, 3.1748559 47.0016982, 3.1747628 47.0018250, 3.1745232 47.0020310, 3.1742748 47.0022404, 3.1741059 47.0023258, 3.1732537 47.0033526, 3.1729306 47.0035744, 3.1727515 47.0037669, 3.1724411 47.0038971, 3.1722782 47.0040876, 3.1720282 47.0042208, 3.1719391 47.0043498, 3.1712570 47.0048373, 3.1712294 47.0050945, 3.1709081 47.0053958, 3.1706914 47.0057021, 3.1705850 47.0057668, 3.1705073 47.0057503, 3.1701914 47.0059799, 3.1696775 47.0054821, 3.1686222 47.0048556, 3.1676128 47.0055023, 3.1656913 47.0064013, 3.1640807 47.0067888, 3.1622466 47.0069951, 3.1607268 47.0070346, 3.1569770 47.0068234, 3.1565688 47.0068137, 3.1531001 47.0067310, 3.1510008 47.0066388, 3.1500150 47.0065196, 3.1492936 47.0063801, 3.1486924 47.0062256, 3.1473549 47.0057266, 3.1461965 47.0050907, 3.1454657 47.0045722, 3.1447973 47.0038357, 3.1442318 47.0028952, 3.1436267 47.0030236, 3.1428986 47.0016324, 3.1405847 46.9998008, 3.1403113 46.9993979, 3.1392481 46.9995785, 3.1368687 46.9997233, 3.1299521 46.9960261, 3.1290454 46.9962508, 3.1284881 46.9963099, 3.1283387 46.9963257, 3.1262897 46.9962285, 3.1244499 46.9961559, 3.1233227 46.9962062, 3.1216732 46.9963885, 3.1219553 46.9956724, 3.1214029 46.9955538, 3.1214167 46.9953974, 3.1210357 46.9951325, 3.1214315 46.9945823, 3.1212131 46.9942095, 3.1209823 46.9934531, 3.1215222 46.9926717, 3.1219733 46.9921352, 3.1219161 46.9916870, 3.1224522 46.9911461, 3.1225131 46.9908948, 3.1224648 46.9900254, 3.1223734 46.9895557, 3.1223546 46.9882703, 3.1194926 46.9882372, 3.1185534 46.9882306, 3.1184301 46.9881833, 3.1180397 46.9880927, 3.1173542 46.9878326, 3.1172447 46.9870531))')
where name = 'Nevers';

