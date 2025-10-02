/*
Supports the following formats

Date/Time formats	
	
ISO 8601–style formats	
^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[\+\-]\d{2}:\d{2})?)?$	
	
	Date/Time
	YYYY-MM-DD
	YYYY-MM-DDTHH:MM
	YYYY-MM-DDTHH:MM:SS
	YYYY-MM-DDTHH:MM:SS.sss
	
SQL–style formats	
^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2}(\.\d{3})?)?$	
	
	YYYY-MM-DD HH:MM
	YYYY-MM-DD HH:MM:SS
	YYYY-MM-DD HH:MM:SS.sss
	

*/

/*
The following is not working properly:

	With timezone:
	YYYY-MM-DDTHH:MMZ
	YYYY-MM-DDTHH:MM±HH:MM
	YYYY-MM-DDTHH:MM:SSZ
	YYYY-MM-DDTHH:MM:SS±HH:MM
	YYYY-MM-DDTHH:MM:SS.sssZ
	YYYY-MM-DDTHH:MM:SS.sss±HH:MM
	
Examples:	
	2025-08-11T14:30Z
	2025-08-11T14:30+02:00
	2025-08-11T14:30:45.123-05:00
*/

export function isCrossPlatformDate(str: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[\+\-]\d{2}:\d{2})?)?$/;
  const sqlRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2}(\.\d{3})?)?$/;

  if (!isoRegex.test(str) && !sqlRegex.test(str)) return false;

  const jsDate = new Date(str.replace(" ", "T")); // Normalize SQL format to ISO
  return !isNaN(jsDate.getTime());
}

