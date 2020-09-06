const addTestCases = (fn_source_code) => {
  /*
    Params: 
        fn_source_code: string, function answer source code
  */
  FUNCTION_TITLE = "isToeplitzMatrix";

  TEST_CASE_1 = "[[1,2,3,4],[5,1,2,3],[9,5,1,2]] ||-->|| True";
  TEST_CASE_2 = "[[1,2],[2,2]] ||-->|| False";
  TEST_CASE_3 = "[[7,8,9,0],[0,7,8,9],[9,0,7,8],[8,9,0,7]] ||-->|| True";

  PARAMS_ANS_1 = TEST_CASE_1.split("||-->||");
  PARAMS_ANS_2 = TEST_CASE_2.split("||-->||");
  PARAMS_ANS_3 = TEST_CASE_3.split("||-->||");
  fn_source_code += `\nprint(${FUNCTION_TITLE}(${PARAMS_ANS_1[0].trim()})==${PARAMS_ANS_1[1].trim()})`;
  fn_source_code += `\nprint(${FUNCTION_TITLE}(${PARAMS_ANS_2[0].trim()})==${PARAMS_ANS_2[1].trim()})`;
  fn_source_code += `\nprint(${FUNCTION_TITLE}(${PARAMS_ANS_3[0].trim()})==${PARAMS_ANS_3[1].trim()})`;
  return fn_source_code;
};

module.exports = { addTestCases: addTestCases };
