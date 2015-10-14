package ar.com.leafnoise.util;

import java.util.List;

public class PaginationUtil {

	private long iTotalRecords, iTotalDisplayRecords, sEcho;
	private List<? extends Object> data;
	
	public long getiTotalRecords() {
		return iTotalRecords;
	}
	public void setiTotalRecords(long iTotalRecords) {
		this.iTotalRecords = iTotalRecords;
	}
	public List<? extends Object> getData() {
		return data;
	}
	public void setData(List<? extends Object> data) {
		this.data = data;
	}
	public long getiTotalDisplayRecords() {
		return iTotalDisplayRecords;
	}
	public void setiTotalDisplayRecords(long iTotalDisplayRecords) {
		this.iTotalDisplayRecords = iTotalDisplayRecords;
	}
	public long getSEcho() {
		return sEcho;
	}
	public void setSEcho(long sEcho) {
		this.sEcho = sEcho;
	}
}
