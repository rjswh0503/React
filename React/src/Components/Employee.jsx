import React, { useEffect, useState } from "react";
import api from "../api/api";
import SearchBar from "../Components/Search"; // 경로는 프로젝트에 맞게 수정

const Employee = () => {
  const [employee, setEmployee] = useState([]);      // 전체 목록
  const [searchList, setSearchList] = useState([]);  // 검색 결과
  const [isSearching, setIsSearching] = useState(false); // 검색모드 여부

  // 전체 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await api.get("/api/admin/employees");
        setEmployee(responseData.data);
      } catch (e) {
        console.error("데이터 가져오기 실패", e);
      }
    };
    fetchData();
  }, []);

  // 검색 실행
  const handleSearch = async (position) => {
    const keyword = position?.trim();
    if (!keyword) return;

    try {
      const res = await api.get("/api/employees/search/position", {
        params: { position: keyword },
      });

      setSearchList(res.data);
      setIsSearching(true); // ✅ 검색모드 ON → 전체 리스트 숨김
    } catch (e) {
      console.error("검색 실패", e);
      setSearchList([]);
      setIsSearching(true); // 검색은 했는데 결과 없음도 표현하려면 true 유지
    }
  };

  // 전체보기(리셋)
  const handleReset = () => {
    setIsSearching(false);
    setSearchList([]);
  };

  // 화면에 뿌릴 데이터: 검색중이면 searchList, 아니면 employee
  const rows = (isSearching ? searchList : employee).filter(
    (emp) => emp.role !== "ADMIN" && emp.position !== "관리자"
  );

  return (
    <div>
      {/* ✅ 검색 컴포넌트 */}
      <SearchBar onSearch={handleSearch} onReset={handleReset} />

      {/* ✅ 검색 결과 없음 메시지 (검색했을 때만) */}
      {isSearching && rows.length === 0 && (
        <div style={{ padding: "0 20px" }}>검색 결과가 없습니다.</div>
      )}

      {/* ✅ 테이블은 rows 있을 때만 */}
      {rows.length > 0 && (
        <div style={{ padding: "20px" }}>
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "12px", width: "11%" }}>사원번호</th>
                <th style={{ padding: "12px", width: "11%" }}>이름</th>
                <th style={{ padding: "12px", width: "20%" }}>이메일</th>
                <th style={{ padding: "12px", width: "20%" }}>전화번호</th>
                <th style={{ padding: "12px", width: "10%" }}>직급</th>
                <th style={{ padding: "12px", width: "15%" }}>부서</th>
                <th style={{ padding: "12px", width: "15%" }}>입사일</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ padding: "12px", width: "10%" }}>{emp.employeeNo}</td>
                  <td style={{ padding: "12px", width: "10%" }}>{emp.name}</td>
                  <td style={{ padding: "12px", width: "20%" }}>{emp.email}</td>
                  <td style={{ padding: "12px", width: "15%" }}>{emp.phone}</td>
                  <td style={{ padding: "12px", width: "10%" }}>{emp.position}</td>
                  <td style={{ padding: "12px", width: "15%" }}>
                    {emp.department?.departName || "관리자"}
                  </td>
                  <td style={{ padding: "10px", width: "15%" }}>{emp.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Employee;