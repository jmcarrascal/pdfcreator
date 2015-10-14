package ar.com.leafnoise.wrapper;

import java.util.Date;

public class FiltersBloqueo {
	
	private Date fechaDesde;
	private Date fechaHasta;
	private Integer idCausaBloqueo;
	private String causa;
	private String descripcion;
	private String pedidoWoNro;
	
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
	public Integer getIdCausaBloqueo() {
		return idCausaBloqueo;
	}
	public String getCausa() {
		return causa;
	}
	public void setCausa(String causa) {
		this.causa = causa;
	}
	public void setIdCausaBloqueo(Integer idCausaBloqueo) {
		this.idCausaBloqueo = idCausaBloqueo;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public String getPedidoWoNro() {
		return pedidoWoNro;
	}
	public void setPedidoWoNro(String pedidoWoNro) {
		this.pedidoWoNro = pedidoWoNro;
	}	
}
