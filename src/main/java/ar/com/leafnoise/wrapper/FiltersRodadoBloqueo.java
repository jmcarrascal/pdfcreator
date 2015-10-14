package ar.com.leafnoise.wrapper;

import java.util.Date;

public class FiltersRodadoBloqueo {
	
	private Integer idLineaProduccion;
	private Date fechaDesde;
	private Date fechaHasta;
	
	public Integer getIdLineaProduccion() {
		return idLineaProduccion;
	}
	public void setIdLineaProduccion(Integer idLineaProduccion) {
		this.idLineaProduccion = idLineaProduccion;
	}
	public Date getFechaDesde() {
		return fechaDesde;
	}
	public void setFechaDesde(Date fechaDesde) {
		this.fechaDesde = fechaDesde;
	}
	public Date getFechaHasta() {
		return fechaHasta;
	}
	public void setFechaHasta(Date fechaHasta) {
		this.fechaHasta = fechaHasta;
	}	
	
}
