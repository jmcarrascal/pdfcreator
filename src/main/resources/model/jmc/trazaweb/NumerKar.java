package jmc.trazaweb;

// Generated 04-may-2015 1:14:29 by Hibernate Tools 3.4.0.CR1

/**
 * NumerKar generated by hbm2java
 */
public class NumerKar implements java.io.Serializable {

	private int nr;
	private float letraA;

	public NumerKar() {
	}

	public NumerKar(int nr, float letraA) {
		this.nr = nr;
		this.letraA = letraA;
	}

	public int getNr() {
		return this.nr;
	}

	public void setNr(int nr) {
		this.nr = nr;
	}

	public float getLetraA() {
		return this.letraA;
	}

	public void setLetraA(float letraA) {
		this.letraA = letraA;
	}

}
